// Automated Assessment & Proctoring Integration Test Suite
import http from 'http';

const PORT = 5174;

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, text: data });
        }
      });
    });

    req.on('error', reject);

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING COMPREHENSIVE ASSESSMENT & PROCTORING TESTS');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passedTests++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
    }
  }

  try {
    // TEST 1: Email Health Check
    console.log('--- TEST 1: Email Provider Health Check ---');
    const healthRes = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/email-health',
      method: 'GET'
    });
    assert(healthRes.status === 200, 'GET /api/auth/email-health returned 200 OK');
    assert(healthRes.data?.verified === true, 'Email service is verified with Gmail SMTP');
    assert(healthRes.data?.sender?.includes('recruitcred.security@gmail.com'), 'Sender address correctly configured');

    // TEST 2: Start New Assessment Session
    console.log('\n--- TEST 2: Start Proctored Assessment Session ---');
    const testUserId = `test-user-${Date.now()}`;
    const startRes = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/assessments/start',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      userId: testUserId,
      assessmentId: 'python-core'
    });

    assert(startRes.status === 201 || startRes.status === 200, 'POST /api/assessments/start returned success');
    assert(startRes.data?.session?.id !== undefined, 'Session ID created successfully');
    assert(startRes.data?.session?.status === 'in_progress', 'Initial session status is in_progress');
    assert(startRes.data?.session?.warningCount === 0, 'Initial warning count is 0');

    const sessionId = startRes.data.session.id;

    // TEST 3: Retrieve Existing Session on Reload / Navigation
    console.log('\n--- TEST 3: Retrieve Assessment Session (Refresh Test) ---');
    const getSessRes = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: `/api/assessments/session/${sessionId}`,
      method: 'GET'
    });
    assert(getSessRes.status === 200, 'GET /api/assessments/session/:sessionId returned 200 OK');
    assert(getSessRes.data?.session?.id === sessionId, 'Retrieved session matches created sessionId');
    assert(getSessRes.data?.session?.status === 'in_progress', 'Retrieved session status is in_progress');

    // TEST 4: Record Proctoring Warning 1 (Focus Loss / Tab Switch)
    console.log('\n--- TEST 4: Record Proctoring Warning 1/3 (Tab Switch) ---');
    const warn1Res = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/assessments/violation',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      sessionId,
      userId: testUserId,
      type: 'focus_loss',
      details: 'Candidate switched away from assessment window.',
      severity: 'medium'
    });
    assert(warn1Res.status === 200, 'POST /api/assessments/violation returned 200 OK');
    assert(warn1Res.data?.warningCount === 1, 'Warning count incremented to 1');
    assert(warn1Res.data?.autoSubmitted === false, 'Session not auto-submitted on warning 1');

    // TEST 5: Record Proctoring Warning 2 (Prohibited Object)
    console.log('\n--- TEST 5: Record Proctoring Warning 2/3 (Prohibited Object) ---');
    const warn2Res = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/assessments/violation',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      sessionId,
      userId: testUserId,
      type: 'prohibited_object',
      details: 'Prohibited electronic device detected in frame.',
      severity: 'medium'
    });
    assert(warn2Res.status === 200, 'POST /api/assessments/violation returned 200 OK');
    assert(warn2Res.data?.warningCount === 2, 'Warning count incremented to 2');
    assert(warn2Res.data?.autoSubmitted === false, 'Session not auto-submitted on warning 2');

    // TEST 6: Record Proctoring Warning 3 (Fullscreen Exit / 3rd Warning -> Auto Submit)
    console.log('\n--- TEST 6: Record Proctoring Warning 3/3 (Triggers Auto-Submit) ---');
    const warn3Res = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/assessments/violation',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      sessionId,
      userId: testUserId,
      type: 'fullscreen_exit',
      details: 'Candidate exited fullscreen mode.',
      severity: 'high'
    });
    assert(warn3Res.status === 200, 'POST /api/assessments/violation returned 200 OK');
    assert(warn3Res.data?.warningCount === 3, 'Warning count reached 3');
    assert(warn3Res.data?.autoSubmitted === true, 'Session automatically submitted on 3rd warning');
    assert(warn3Res.data?.status === 'locked', 'Session status transitioned to locked');

    // TEST 7: Critical Cheating (>3 People Detected -> Immediate Auto-Submit)
    console.log('\n--- TEST 7: Critical Cheating (>3 People -> Immediate Auto-Submit) ---');
    const criticalUserId = `critical-user-${Date.now()}`;
    const startCriticalRes = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/assessments/start',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      userId: criticalUserId,
      assessmentId: 'python-core'
    });
    const critSessionId = startCriticalRes.data.session.id;

    const critRes = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/assessments/violation',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      sessionId: critSessionId,
      userId: criticalUserId,
      type: 'multiple_people_critical',
      details: 'More than 3 people were detected in the camera frame.',
      metadata: { faceCount: 4 },
      severity: 'high'
    });
    assert(critRes.status === 200, 'POST /api/assessments/violation critical returned 200');
    assert(critRes.data?.cheatingDetected === true, 'Cheating flagged as true');
    assert(critRes.data?.autoSubmitted === true, 'Session immediately auto-submitted');
    assert(critRes.data?.terminationReason?.includes('More than 3 people'), 'Termination reason specifies >3 people detected');

    // TEST 8: Submit Assessment & Grading
    console.log('\n--- TEST 8: Submit Assessment Evaluation & Grading ---');
    const submitUserId = `submit-user-${Date.now()}`;
    const startSubmitRes = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/assessments/start',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      userId: submitUserId,
      assessmentId: 'python-core'
    });
    const subSessionId = startSubmitRes.data.session.id;

    const submitRes = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/assessments/submit',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      sessionId: subSessionId,
      userId: submitUserId,
      assessmentId: 'python-core',
      answers: { 'py-1': 1, 'py-2': 1, 'py-3': 0, 'py-4': 2, 'py-5': 1, 'py-6': 2, 'py-7': 1, 'py-8': 2 },
      timeSpentSeconds: 320
    });
    assert(submitRes.status === 200, 'POST /api/assessments/submit returned 200 OK');
    assert(submitRes.data?.attempt?.score >= 0, 'Attempt has valid score');
    assert(submitRes.data?.attempt?.totalQuestions > 0, 'Total questions recorded');
    assert(submitRes.data?.attempt?.submittedAt !== undefined, 'Submission timestamp recorded');

  } catch (err) {
    console.error('Test execution exception:', err);
  }

  console.log(`\n====================================================`);
  console.log(`📊 TEST RESULTS: ${passedTests}/${totalTests} PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log(`====================================================\n`);

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
