:root{
  --bg:#0a0a12; --surface:#12111d; --surface2:#181729; --line:#242238;
  --violet:#a855f7; --pink:#ec4899; --text:#eae8f5; --muted:#8f8ba8;
  --good:#34d399; --warn:#fbbf24; --danger:#f87171;
}
*{box-sizing:border-box;}
html,body,#root{height:100%;}
body{margin:0; background:var(--bg);}
.app{
  background:var(--bg); color:var(--text); min-height:100vh; width:100%;
  font-family:'Inter',system-ui,sans-serif; padding:0 0 40px 0;
}
.spin{animation:spin 1s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}

.topbar{
  display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px;
  padding:22px 28px; border-bottom:1px solid var(--line);
  background:linear-gradient(180deg,rgba(168,85,247,.06),transparent);
  position:sticky; top:0; z-index:10; backdrop-filter:blur(10px);
}
.brand{display:flex; align-items:center; gap:12px;}
.brand-mark{width:36px; height:36px; border-radius:9px; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,var(--violet),var(--pink)); color:#fff;}
.brand-name{font-family:'JetBrains Mono',monospace; font-weight:700; font-size:15px; letter-spacing:.5px;}
.brand-name span{color:var(--pink);}
.brand-sub{font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--muted); letter-spacing:.5px; text-transform:uppercase;}

.tabs{display:flex; gap:6px; background:var(--surface); padding:4px; border-radius:10px; border:1px solid var(--line);}
.tab{display:flex; align-items:center; gap:6px; padding:8px 14px; border-radius:7px; border:none; background:transparent; color:var(--muted); font-size:13px; font-weight:600; cursor:pointer; transition:.15s;}
.tab:hover:not(:disabled){color:var(--text);}
.tab.active{background:linear-gradient(135deg,var(--violet),var(--pink)); color:#fff;}
.tab:disabled{opacity:.35; cursor:not-allowed;}
.key-btn{white-space:nowrap;}

.layout{display:grid; grid-template-columns:360px 1fr; gap:0; max-width:1400px; margin:0 auto;}
@media(max-width:900px){.layout{grid-template-columns:1fr;}}

.panel{padding:26px; border-right:1px solid var(--line); position:sticky; top:78px; align-self:start; max-height:calc(100vh - 78px); overflow-y:auto;}
.panel.wide{grid-column:1/-1; border-right:none; border-bottom:1px solid var(--line); position:static; max-height:none;}

.field-label{display:block; font-size:11px; text-transform:uppercase; letter-spacing:.8px; color:var(--muted); margin-bottom:8px; font-weight:600;}
.textarea, .text-input{width:100%; background:var(--surface); border:1px solid var(--line); border-radius:10px; color:var(--text); padding:12px 14px; font-family:'JetBrains Mono',monospace; font-size:12.5px; line-height:1.6; resize:vertical;}
.textarea:focus, .text-input:focus{outline:none; border-color:var(--violet);}
.upload-row{display:flex; align-items:center; justify-content:space-between; margin-top:8px; flex-wrap:wrap; gap:8px;}
.upload-inline{display:flex; flex-direction:column;}
.hint{font-size:11px; color:var(--muted);}
.inline-input{display:flex; gap:8px;}
.inline-input .text-input{flex:1;}

.btn-primary{margin-top:16px; width:100%; display:flex; align-items:center; justify-content:center; gap:8px; background:linear-gradient(135deg,var(--violet),var(--pink)); border:none; color:#fff; font-weight:700; padding:12px; border-radius:10px; cursor:pointer; font-size:13.5px; transition:.15s;}
.btn-primary:hover:not(:disabled){filter:brightness(1.1); transform:translateY(-1px);}
.btn-primary:disabled{opacity:.6; cursor:not-allowed;}
.btn-ghost{display:flex; align-items:center; gap:6px; background:transparent; border:1px solid var(--line); color:var(--muted); padding:7px 12px; border-radius:8px; cursor:pointer; font-size:12px;}
.btn-ghost:hover{border-color:var(--violet); color:var(--text);}
.icon-btn{background:transparent; border:1px solid var(--line); color:var(--muted); border-radius:8px; width:36px; height:36px; display:flex; align-items:center; justify-content:center; cursor:pointer;}
.icon-btn:hover{color:var(--text); border-color:var(--violet);}

.error{margin-top:12px; display:flex; gap:8px; align-items:flex-start; color:var(--danger); font-size:12.5px; background:rgba(248,113,113,.08); padding:10px; border-radius:8px;}

.results{padding:26px; min-height:400px;}
.empty{display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; gap:12px; color:var(--muted); padding:80px 20px;}
.empty p{max-width:340px; font-size:13.5px; line-height:1.6;}

.loading-block{display:flex; flex-direction:column; align-items:center; gap:18px; padding:60px 20px;}
.loading-text{font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--violet); letter-spacing:.3px;}
.scanner{position:relative; width:280px; height:200px; background:var(--surface); border:1px solid var(--line); border-radius:10px; overflow:hidden; padding:16px;}
.scanner-doc{display:flex; flex-direction:column; gap:9px;}
.scanner-line{height:6px; background:var(--surface2); border-radius:3px;}
.scanner-sweep{position:absolute; left:0; right:0; height:40px; top:-40px; background:linear-gradient(180deg,transparent,rgba(168,85,247,.35),transparent); animation:sweep 1.8s linear infinite;}
@keyframes sweep{0%{top:-40px;} 100%{top:200px;}}

.report{display:flex; flex-direction:column; gap:18px; max-width:900px;}
.report-hero{display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap; padding-bottom:6px;}
.hero-eyebrow{font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--pink); text-transform:uppercase; letter-spacing:.8px; margin-bottom:4px;}
.report-hero h2{margin:0 0 8px 0; font-size:26px;}
.hero-summary{color:var(--muted); font-size:13.5px; line-height:1.6; max-width:480px;}

.card{background:var(--surface); border:1px solid var(--line); border-radius:14px; padding:20px;}
.card-head{display:flex; gap:10px; align-items:center; margin-bottom:14px;}
.card-icon{width:30px; height:30px; border-radius:8px; background:var(--surface2); display:flex; align-items:center; justify-content:center; color:var(--violet);}
.card-eyebrow{font-size:10px; color:var(--muted); text-transform:uppercase; letter-spacing:.6px;}
.card h3{margin:0; font-size:15px;}

.ring-row{display:flex; gap:22px; flex-wrap:wrap; margin-bottom:6px;}
.ring-wrap{position:relative; display:flex; flex-direction:column; align-items:center; gap:6px;}
.ring-center{position:absolute; top:0; left:0; right:0; bottom:0; display:flex; align-items:center; justify-content:center;}
.ring-value{font-family:'JetBrains Mono',monospace; font-weight:700; font-size:16px;}
.ring-label{font-size:10.5px; color:var(--muted); text-align:center;}

.bar-row{display:grid; grid-template-columns:130px 1fr 40px; align-items:center; gap:10px; margin-bottom:9px; font-size:12px;}
.bar-label{color:var(--muted); text-transform:capitalize; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
.bar-track{height:8px; background:var(--surface2); border-radius:4px; overflow:hidden;}
.bar-fill{height:100%; border-radius:4px;}
.bar-value{text-align:right; font-family:'JetBrains Mono',monospace; color:var(--muted);}

.chip{display:inline-flex; align-items:center; gap:4px; font-size:11.5px; padding:4px 10px; border-radius:100px; margin:0 6px 6px 0; background:var(--surface2); color:var(--text); border:1px solid var(--line);}
.chip-good{border-color:rgba(52,211,153,.4); color:var(--good);}
.chip-danger{border-color:rgba(248,113,113,.4); color:var(--danger);}
.chip-warn{border-color:rgba(251,191,36,.4); color:var(--warn);}
.chip-accent{border-color:rgba(168,85,247,.4); color:var(--violet);}

.two-col{display:grid; grid-template-columns:1fr 1fr; gap:20px;}
@media(max-width:600px){.two-col{grid-template-columns:1fr;}}
.mini-head{font-size:11px; text-transform:uppercase; color:var(--muted); letter-spacing:.6px; margin-bottom:8px; font-weight:600;}

.issue-list{list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:8px; font-size:12.5px; color:var(--muted);}
.issue-list li{display:flex; align-items:center; gap:8px;}

.rewrite-list, .rewrite-block{display:flex; flex-direction:column; gap:10px;}
.rewrite-item{display:flex; align-items:center; gap:10px; font-size:12px; background:var(--surface2); padding:10px 12px; border-radius:8px;}
.rw-before{color:var(--danger); flex:1;}
.rw-after{color:var(--good); flex:1;}
.rw-arrow{color:var(--muted); flex-shrink:0;}
.rewrite-block{background:var(--surface2); padding:12px 14px; border-radius:8px; font-size:12.5px; gap:6px;}
.rewrite-block .rw-before{color:var(--danger);}
.rewrite-block .rw-after{color:var(--good);}

.star-row{display:grid; grid-template-columns:1fr auto 1fr; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid var(--line); font-size:12.5px;}
.star-row:last-child{border-bottom:none;}
.star-dots{display:flex; gap:4px;}
.star-dot{width:22px; height:22px; border-radius:5px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; background:var(--surface2); color:var(--muted);}
.star-dot.on{background:linear-gradient(135deg,var(--violet),var(--pink)); color:#fff;}
.star-note{color:var(--muted); font-size:11.5px;}

.heat-row{display:flex; align-items:center; gap:10px; padding:7px 0; font-size:12.5px;}
.rdot{width:9px; height:9px; border-radius:50%; flex-shrink:0;}
.heat-section{font-weight:600; min-width:110px;}
.heat-note{color:var(--muted);}

.grid-2{display:grid; grid-template-columns:1fr 1fr; gap:18px;}
@media(max-width:700px){.grid-2{grid-template-columns:1fr;}}
.salary-row{display:flex; justify-content:space-between; padding:6px 0; font-size:12.5px; text-transform:capitalize;}
.salary-lvl{color:var(--muted);}
.salary-range{font-family:'JetBrains Mono',monospace;}
.fine-print{font-size:11.5px; color:var(--muted); line-height:1.6; margin:8px 0 0 0;}
.fine-print a{color:var(--violet);}
.level-block{text-align:center; padding:10px 0;}
.level-title{font-size:18px; font-weight:700;}
.level-conf{color:var(--violet); font-size:12px; margin-top:4px; font-family:'JetBrains Mono',monospace;}

.q-list{margin:0; padding-left:18px; display:flex; flex-direction:column; gap:10px; font-size:12.5px; color:var(--text);}

.stat-strip{display:flex; gap:20px; flex-wrap:wrap; margin-top:14px; font-size:12px; color:var(--muted);}
.stat-strip strong{color:var(--text); font-family:'JetBrains Mono',monospace; margin-right:4px;}
.repo-row{display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--line); gap:12px;}
.repo-row:last-child{border-bottom:none;}
.repo-name{font-weight:600; font-size:13px;}
.repo-desc{color:var(--muted); font-size:11.5px; margin-top:2px;}
.repo-stats{display:flex; gap:12px; font-size:11.5px; color:var(--muted); flex-shrink:0;}

.cmp-row{padding:12px 0; border-bottom:1px solid var(--line);}
.cmp-row:last-child{border-bottom:none;}
.cmp-name{font-weight:600; font-size:13px; margin-bottom:8px;}

.chat-layout{max-width:800px; margin:0 auto; padding:26px; display:flex; flex-direction:column; height:calc(100vh - 78px);}
.chat-window{flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:12px; padding-bottom:16px;}
.msg{display:flex;}
.msg.user{justify-content:flex-end;}
.msg-bubble{max-width:75%; padding:11px 15px; border-radius:14px; font-size:13.5px; line-height:1.6;}
.msg.user .msg-bubble{background:linear-gradient(135deg,var(--violet),var(--pink)); color:#fff; border-bottom-right-radius:4px;}
.msg.assistant .msg-bubble{background:var(--surface); border:1px solid var(--line); border-bottom-left-radius:4px;}
.chat-input-row{display:flex; gap:10px; padding-top:12px; border-top:1px solid var(--line);}
.chat-input-row .text-input{flex:1;}
.chat-input-row .btn-primary{margin-top:0; width:auto; padding:12px 18px;}

.modal-backdrop{position:fixed; inset:0; background:rgba(5,5,10,.7); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:100; padding:20px;}
.modal{background:var(--surface); border:1px solid var(--line); border-radius:16px; padding:26px; max-width:440px; width:100%;}
.modal-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;}
.modal-title{display:flex; align-items:center; gap:8px; font-weight:700; font-size:15px;}
.key-input-row{display:flex; gap:8px; margin:14px 0;}
.key-input-row .text-input{flex:1;}
.modal-actions{display:flex; justify-content:space-between; align-items:center; margin-top:16px;}

.footer{text-align:center; color:var(--muted); font-size:11px; padding:30px 20px 0 20px; max-width:600px; margin:0 auto;}
