const crypto = require('crypto');
const handler = require('../api/tubitak-records.js');

const SECRET_KEY = 'rotali-tubitak-auth-secret-key-2026';
function makeToken(payload) {
    const raw = JSON.stringify(payload);
    const b64 = Buffer.from(raw).toString('base64url');
    const sig = crypto.createHmac('sha256', SECRET_KEY).update(b64).digest('base64url');
    return b64 + '.' + sig;
}

function mockReqRes(options) {
    const req = {
        method: options.method || 'GET',
        headers: options.headers || {},
        query: options.query || {},
        body: options.body || {}
    };
    const res = {
        statusCode: 200,
        _headers: {},
        setHeader(k, v) { this._headers[k.toLowerCase()] = v; },
        status(code) { this.statusCode = code; return this; },
        json(data) { this._json = data; return this; },
        send(buf) { this._buffer = buf; return this; },
        end() { return this; }
    };
    return { req, res };
}

(async () => {
    console.log('--- TESTING SINGLE WORD (.DOCX) EXPORT ---');

    // 1. Mustafa Emin YERLİKAYA token
    const tokenMustafa = makeToken({
        role: 'student',
        projectId: 'proje-bilim',
        studentId: 'stu2-mustafa',
        studentName: 'Mustafa Emin YERLİKAYA',
        exp: Date.now() + 3600000
    });

    // 2. Reyyan YILMAZ token (different student in same project)
    const tokenReyyan = makeToken({
        role: 'student',
        projectId: 'proje-bilim',
        studentId: 'stu2-reyyan',
        studentName: 'Reyyan YILMAZ',
        exp: Date.now() + 3600000
    });

    // 3. Generic student token (just password entered)
    const tokenGeneric = makeToken({
        role: 'student',
        projectId: 'proje-bilim',
        studentId: 'stu-bili-ogrenciara',
        studentName: 'Öğrenci Araştırmacı',
        exp: Date.now() + 3600000
    });

    // Test 1: Mustafa Emin YERLİKAYA downloading #57 ABDÜLMELİK eş-ŞÎRÂZÎ
    const { req: req1, res: res1 } = mockReqRes({
        headers: { authorization: 'Bearer ' + tokenMustafa },
        query: { projectId: 'proje-bilim', exportDocx: 'single', itemId: 'bilim-58-abdulmelik-es-sirazi' }
    });
    await handler(req1, res1);
    console.log('Test 1 (Mustafa) status:', res1.statusCode, 'buffer bytes:', res1._buffer?.length, 'disposition:', res1._headers['content-disposition']);

    // Test 2: Reyyan YILMAZ downloading Mustafa's topic
    const { req: req2, res: res2 } = mockReqRes({
        headers: { authorization: 'Bearer ' + tokenReyyan },
        query: { projectId: 'proje-bilim', exportDocx: 'single', itemId: 'bilim-58-abdulmelik-es-sirazi' }
    });
    await handler(req2, res2);
    console.log('Test 2 (Reyyan) status:', res2.statusCode, 'buffer bytes:', res2._buffer?.length, 'error:', res2._json?.error);

    // Test 3: Generic student
    const { req: req3, res: res3 } = mockReqRes({
        headers: { authorization: 'Bearer ' + tokenGeneric },
        query: { projectId: 'proje-bilim', exportDocx: 'single', itemId: 'bilim-58-abdulmelik-es-sirazi' }
    });
    await handler(req3, res3);
    console.log('Test 3 (Generic) status:', res3.statusCode, 'buffer bytes:', res3._buffer?.length, 'error:', res3._json?.error);

    // Test 4: Token in query string (direct download URL / iframe fallback)
    const { req: req4, res: res4 } = mockReqRes({
        query: { projectId: 'proje-bilim', exportDocx: 'single', itemId: 'bilim-58-abdulmelik-es-sirazi', token: tokenMustafa }
    });
    await handler(req4, res4);
    console.log('Test 4 (Query token) status:', res4.statusCode, 'buffer bytes:', res4._buffer?.length, 'error:', res4._json?.error);

    // Test 5: Verify CORS Expose-Headers
    console.log('Test 5 (CORS expose headers):', res1._headers['access-control-expose-headers']);

    const allPassed = res1.statusCode === 200 && res1._buffer?.length > 1000 &&
                      res2.statusCode === 200 && res2._buffer?.length > 1000 &&
                      res3.statusCode === 200 && res3._buffer?.length > 1000 &&
                      res4.statusCode === 200 && res4._buffer?.length > 1000 &&
                      res1._headers['access-control-expose-headers'].includes('Content-Disposition');

    if (allPassed) {
        console.log('✅ ALL SINGLE WORD EXPORT TESTS PASSED PERFECTLY!');
        process.exit(0);
    } else {
        console.error('❌ SOME TESTS FAILED');
        process.exit(1);
    }
})();
