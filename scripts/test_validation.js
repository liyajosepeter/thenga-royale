const http = require('http');

function postJson(path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, text: body });
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('=== STARTING VALIDATION API INTEGRATION TESTS ===\n');

  // Test 1: Empty / invalid payload
  console.log('Test 1: Empty payload check');
  const emptyRes = await postJson('/api/validate', {});
  console.log('Empty response status:', emptyRes.status, 'Body:', emptyRes.data);

  // Test 2: Valid sample palm
  console.log('\nTest 2: Sample palm validation');
  const samplePalmB64 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23134434'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='32' fill='%2338b289'%3E🌴%3C/text%3E%3C/svg%3E";
  const validRes = await postJson('/api/validate', {
    image_base64: samplePalmB64,
    name: 'Sample Royal Palm'
  });
  console.log('Valid Palm result:', validRes.data);

  // Test 3: Batch mixed items
  console.log('\nTest 3: Batch validation (1 valid, 1 invalid)');
  const batchRes = await postJson('/api/validate', {
    items: [
      { id: 'palm-1', name: 'Lord of Varkala', image_base64: samplePalmB64 },
      { id: 'palm-2', name: 'Blank Screen', image_base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=' }
    ]
  });
  console.log('Batch response status:', batchRes.status, 'Results:', JSON.stringify(batchRes.data, null, 2));

  console.log('\n=== ALL API VALIDATION TESTS COMPLETED ===');
}

runTests().catch(console.error);
