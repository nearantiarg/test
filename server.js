const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const PORT=process.env.PORT||3000, root=path.join(__dirname,'public'), data=path.join(__dirname,'data','requests.json');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.svg':'image/svg+xml'};
function respond(res,status,obj){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(obj));}
function validate(v){return v&&typeof v.name==='string'&&v.name.trim().length>=2&&v.name.length<=100&&typeof v.phone==='string'&&/^[+()\d\s.-]{7,24}$/.test(v.phone)&&['Plumbing','Heating','Mechanical piping','Other'].includes(v.service)&&typeof v.message==='string'&&v.message.length<=1500&&(!v.email||(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)&&v.email.length<=150));}
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(req.method==='POST'&&url.pathname==='/api/requests'){
  let body='';req.on('data',chunk=>{body+=chunk;if(body.length>12000)req.destroy();});req.on('end',()=>{let v;try{v=JSON.parse(body)}catch{return respond(res,400,{error:'Invalid JSON'})}if(!validate(v)||v.website)return respond(res,400,{error:'Please check your details'});
  const entry={id:crypto.randomUUID(),name:v.name.trim(),phone:v.phone.trim(),email:(v.email||'').trim(),service:v.service,message:v.message.trim(),preferredDate:String(v.preferredDate||'').slice(0,30),createdAt:new Date().toISOString()};
  try{fs.mkdirSync(path.dirname(data),{recursive:true});const old=fs.existsSync(data)?JSON.parse(fs.readFileSync(data,'utf8')):[];old.push(entry);fs.writeFileSync(data,JSON.stringify(old,null,2),{mode:0o600});respond(res,201,{ok:true,id:entry.id})}catch(e){console.error(e);respond(res,500,{error:'Unable to save request'})}
  });return;
 }
 if(req.method==='GET'&&url.pathname==='/api/requests'){
  const token=process.env.ADMIN_TOKEN;if(!token||req.headers.authorization!==`Bearer ${token}`)return respond(res,401,{error:'Unauthorized'});
  try{return respond(res,200,fs.existsSync(data)?JSON.parse(fs.readFileSync(data,'utf8')):[])}catch{return respond(res,500,{error:'Read failed'})}
 }
 if(req.method!=='GET')return respond(res,405,{error:'Method not allowed'});
 const pathname=url.pathname==='/'?'/index.html':url.pathname;const target=path.resolve(root,'.'+decodeURIComponent(pathname));if(!target.startsWith(root+path.sep))return respond(res,403,{error:'Forbidden'});
 fs.readFile(target,(err,content)=>{if(err){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(content)});
});
if(require.main===module)server.listen(PORT,()=>console.log(`Website running at http://localhost:${PORT}`));module.exports={server,validate};
