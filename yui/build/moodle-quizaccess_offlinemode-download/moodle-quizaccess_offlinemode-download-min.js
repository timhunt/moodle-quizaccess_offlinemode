YUI.add("moodle-quizaccess_offlinemode-download",function(e,t){M.quizaccess_offlinemode=M.quizaccess_offlinemode||{},M.quizaccess_offlinemode.download={SELECTORS:{QUIZ_FORM:"#responseform"},filename:null,publicKey:null,form:null,init:function(t,n){this.filename=t,this.publicKey=n,e.Crypto.sjcl.random.startCollectors(),e.Crypto.sjcl.beware["CBC mode is dangerous because it doesn't protect message integrity."](),this.form=e.one(this.SELECTORS.QUIZ_FORM);if(!this.form)return;e.delegate("click",this.downloadClicked,"body",".response-download-link",this)},downloadClicked:function(t){var n=t.currentTarget;typeof tinyMCE!="undefined"&&tinyMCE.triggerSave(),n.set("download",this.filename.replace(/-d\d+\.attemptdata/,"-d"+this.getCurrentDatestamp()+".attemptdata"));var r={responses:e.IO.stringify(this.form)};this.publicKey&&(r=this.encryptResponses(r)),n.set("href","data:application/octet-stream,"+e.JSON.stringify(r))},getCurrentDatestamp:function(){function t(e){return e<10?"0"+e:e}var e=new Date;return""+e.getUTCFullYear()+t(e.getUTCMonth()+1)+t(e.getUTCDate())+t(e.getUTCHours())+t(e.getUTCMinutes())},encryptResponses:function(t){var n=e.Crypto.sjcl.random.randomWords(8),r={},i=e.Crypto.sjcl.encrypt(n,t.responses,{ks:256,mode:"cbc"},r),s=new e.Crypto.JSEncrypt;return s.setPublicKey(this.publicKey),{responses:e.JSON.parse(i).ct,key:s.encrypt(e.Crypto.sjcl.codec.base64.fromBits(n)),iv:s.encrypt(e.Crypto.sjcl.codec.base64.fromBits(r.iv))}}}},"@VERSION@",{requires:["base","node","event","node-event-delegate","json","io-form","moodle-quizaccess_offlinemode-jsencrypt","moodle-quizaccess_offlinemode-sjcl"]});
