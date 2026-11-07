import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { extractTextFromPDF } from '../src/services/pdfParser.js';
const base = process.env.TEST_API_URL || 'http://127.0.0.1:3000';
const upload = async (bytes, name='resume.pdf', type='application/pdf') => {
  const form = new FormData(); form.append('resume', new Blob([bytes],{type}), name);
  return fetch(`${base}/api/upload`, {method:'POST',body:form});
};
assert.equal((await upload('not a pdf')).status,400);
assert.equal((await upload('text','resume.txt','text/plain')).status,400);
assert.equal((await upload(Buffer.alloc(5*1024*1024+1))).status,413);
console.log('PASS invalid type, corrupt file, and oversize validation');
const sample = await readFile(new URL('../../tests/fixtures/sample-resume.pdf',import.meta.url));
const response = await upload(sample);
assert.equal(response.status,202);
const cookie = response.headers.get('set-cookie').split(';')[0];
const {jobId} = await response.json();
assert.equal((await fetch(`${base}/api/upload/${jobId}`)).status,404);
let result;
const deadline=Date.now()+180000;
while(Date.now()<deadline){
  const res=await fetch(`${base}/api/upload/${jobId}`,{headers:{Cookie:cookie}});
  assert.equal(res.status,200);result=await res.json();
  if(result.status==='failed')throw new Error(result.error);
  if(result.status==='completed')break;
  await new Promise(resolve=>setTimeout(resolve,2000));
}
assert.equal(result.status,'completed');assert.match(result.data.contact.name,/Alex Morgan/);
assert.ok(result.data.atsScore>=0 && result.data.atsScore<=100);
console.log('PASS real PDF upload → AI result, session isolation, and durable status');
const resumeData={...result.data, summary:'Literal <script>example</script> & text',customSections:[{title:'Certifications',content:'Example Cloud Certification, 2026'}]};
for(const format of ['pdf','docx']){
  const res=await fetch(`${base}/api/export/${format}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({resumeData})});
  assert.equal(res.status,200);const bytes=Buffer.from(await res.arrayBuffer());
  if(format==='pdf'){
    assert.equal(bytes.subarray(0,5).toString(),'%PDF-');
    const text=await extractTextFromPDF(bytes);assert.match(text,/Example Cloud Certification/);assert.match(text,/<script>example<\/script> & text/);
  }else assert.equal(bytes.subarray(0,2).toString(),'PK');
  console.log(`PASS ${format.toUpperCase()} export`);
}
for(const [route,body] of [['matches',{jobTitle:'Software Engineer'}],['recruiters',{company:'Example Labs',jobTitle:'Software Engineer'}]]){
 const res=await fetch(`${base}/api/jobs/${route}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});assert.equal(res.status,200);const data=await res.json();assert.ok(data.searchUrls.linkedin.startsWith('https://www.linkedin.com/'));console.log(`PASS ${route} results/search fallback`);
}
