var API;(function(xhr){var open;open=XMLHttpRequest.prototype.open;return xhr.prototype.open=function(){open.apply(this,arguments);return this.setRequestHeader('X-Requested-With','XMLHttpRequest');};})(XMLHttpRequest);API=new (function(){var self;self=this;self.uploadFile=function(file,progress,callback){var formData,xhr;xhr=new XMLHttpRequest();xhr.open('POST','/api/upload/file');xhr.upload.onprogress=progress;xhr.onload=function(){var error,response;switch(this.status){case 415:error="This media format is not supported.";break;case 420:error="You're uploading too much! Try again later.";break;case 409:response=JSON.parse(this.responseText);file.isUserOwned=false;file.hash=response.hash;file.isHashed=true;file.updateStatus('done');break;case 200:response=JSON.parse(this.responseText);file.isUserOwned=true;file.hash=response.hash;file.isHashed=true;file.updateStatus('pending');}if(error!=null){if(callback)return callback({error:error});}else if(callback)return callback({file:file});};formData=new FormData();formData.append('file',file.file);return xhr.send(formData);};self.uploadUrl=function(file,callback){var formData,xhr;xhr=new XMLHttpRequest();xhr.open('POST','/api/upload/url');file.updateStatus('uploading');file.preview.querySelector('.progress').style.width='100%';xhr.onload=function(){var error,response;switch(this.status){case 400:error="This URL is not valid.";break;case 404:error="That URL does not exist, so far as we can tell.";break;case 409:response=JSON.parse(this.responseText);file.isUserOwned=false;file.hash=response.hash;file.isHashed=true;file.updateStatus('done');break;case 413:error="This file is too large.";break;case 415:error="This filetype is not supported.";break;case 420:error="You're uploading too much! Try again later.";break;case 200:response=JSON.parse(this.responseText);file.isUserOwned=true;file.hash=response.hash;file.isHashed=true;file.updateStatus('pending');}if(error)if(callback)callback({file:file,error:error});if(callback)return callback({file:file});};formData=new FormData();formData.append('url',file.file);return xhr.send(formData);};self.checkExists=function(file,callback){var xhr;xhr=new XMLHttpRequest();xhr.open('GET',"/api/"+file.hash+"/exists");xhr.onload=function(){var response;response=JSON.parse(this.responseText);if(callback)return callback(response.exists);};return xhr.send();};self.checkStatus=function(files,callback){var xhr;xhr=new XMLHttpRequest();xhr.open('GET',"/api/status?list="+files);xhr.onload=function(){var response;response=JSON.parse(this.responseText);if(callback)return callback(response);};return xhr.send();};self.deleteFile=function(file){var xhr;xhr=new XMLHttpRequest();xhr.open('DELETE',"/api/"+file);xhr.send();return UserHistory.remove(file);};self.setFlags=function(file,flags){var flag,formData,value,xhr;xhr=new XMLHttpRequest();formData=new FormData();for(flag in flags){value=flags[flag];formData.append(flag,value);}xhr.open('POST',"/api/"+file+"/flags");return xhr.send(formData);};self.createAlbum=function(files,callback){var formData,xhr;xhr=new XMLHttpRequest();formData=new FormData();formData.append('list',files.join(','));xhr.open('POST','/api/album/create');xhr.onload=function(){var result;if(this.status!==200)if(callback)callback({error:true});result=JSON.parse(this.responseText);if(result.error!=null)if(callback)callback({error:true});if(callback)return callback({hash:result.hash});};return xhr.send(formData);};self.zipAlbum=function(hash,callback){var formData,xhr;xhr=new XMLHttpRequest();formData=new FormData();formData.append('hash',hash);xhr.open('POST','/api/album/zip');xhr.onload=function(){var result;if(this.status!==200)if(callback)callback({error:true});result=JSON.parse(this.responseText);if(result.error!=null)if(callback)callback({error:true});if(callback)return callback(result);};return xhr.send(formData);};self.reportFile=function(file){var xhr;xhr=new XMLHttpRequest();xhr.open('POST',"/report/"+window.filename);return xhr.send();};self.setText=function(hash,title,description,callback){var formData,xhr;xhr=new XMLHttpRequest();formData=new FormData();formData.append('title',title);formData.append('description',description);xhr.open('POST',"/api/"+hash+"/text");xhr.onload=function(){if(callback)return callback(self);};return xhr.send(formData);};return self;})();if(typeof window!=="undefined"&&window!==null)window.API=API;(function(){var base64EncodeChars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var base64DecodeChars=new Array(-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,62,-1,-1,-1,63,52,53,54,55,56,57,58,59,60,61,-1,-1,-1,-1,-1,-1,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,-1,-1,-1,-1,-1,-1,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,-1,-1,-1,-1,-1);function base64encode(str){var out,i,len;var c1,c2,c3;len=str.length;i=0;out="";while(i<len){c1=str.charCodeAt(i++)&0xff;if(i==len){out+=base64EncodeChars.charAt(c1>>2);out+=base64EncodeChars.charAt((c1&0x3)<<4);out+="==";break;}c2=str.charCodeAt(i++);if(i==len){out+=base64EncodeChars.charAt(c1>>2);out+=base64EncodeChars.charAt(((c1&0x3)<<4)|((c2&0xF0)>>4));out+=base64EncodeChars.charAt((c2&0xF)<<2);out+="=";break;}c3=str.charCodeAt(i++);out+=base64EncodeChars.charAt(c1>>2);out+=base64EncodeChars.charAt(((c1&0x3)<<4)|((c2&0xF0)>>4));out+=base64EncodeChars.charAt(((c2&0xF)<<2)|((c3&0xC0)>>6));out+=base64EncodeChars.charAt(c3&0x3F);}return out;}function base64decode(str){var c1,c2,c3,c4;var i,len,out;len=str.length;i=0;out="";while(i<len){do c1=base64DecodeChars[str.charCodeAt(i++)&0xff];while(i<len&&c1==-1);if(c1==-1)break;do c2=base64DecodeChars[str.charCodeAt(i++)&0xff];while(i<len&&c2==-1);if(c2==-1)break;out+=String.fromCharCode((c1<<2)|((c2&0x30)>>4));do{c3=str.charCodeAt(i++)&0xff;if(c3==61)return out;c3=base64DecodeChars[c3];}while(i<len&&c3==-1);if(c3==-1)break;out+=String.fromCharCode(((c2&0XF)<<4)|((c3&0x3C)>>2));do{c4=str.charCodeAt(i++)&0xff;if(c4==61)return out;c4=base64DecodeChars[c4];}while(i<len&&c4==-1);if(c4==-1)break;out+=String.fromCharCode(((c3&0x03)<<6)|c4);}return out;}var scope=(typeof window!=="undefined")?window:self;if(!scope.btoa)scope.btoa=base64encode;if(!scope.atob)scope.atob=base64decode;})();function h(a,g){var c=(a&65535)+(g&65535);return(a>>16)+(g>>16)+(c>>16)<<16|c&65535;}function k(a,g,c,l,q,r,b){return h(h(h(a,g&c|~g&l),h(q,b))<<r|h(h(a,g&c|~g&l),h(q,b))>>>32-r,g);}function m(a,g,c,l,q,r,b){return h(h(h(a,g&l|c&~l),h(q,b))<<r|h(h(a,g&l|c&~l),h(q,b))>>>32-r,g);}function n(a,g,c,l,q,r,b){return h(h(h(a,g^c^l),h(q,b))<<r|h(h(a,g^c^l),h(q,b))>>>32-r,g);}function p(a,g,c,l,q,r,b){return h(h(h(a,c^(g|~l)),h(q,b))<<r|h(h(a,c^(g|~l)),h(q,b))>>>32-r,g);}self.rstr_md5=function(a){var g,c=[];c[(a.length>>2)-1]=void 0;for(g=0;g<c.length;g+=1)c[g]=0;for(g=0;g<8*a.length;g+=8)c[g>>5]|=(a.charCodeAt(g/8)&255)<<g%32;a=8*a.length;c[a>>5]|=128<<a%32;c[(a+64>>>9<<4)+14]=a;var l,q,r,b=1732584193,d=-271733879,e=-1732584194,f=271733878;for(a=0;a<c.length;a+=16)g=b,l=d,q=e,r=f,b=k(b,d,e,f,c[a],7,-680876936),f=k(f,b,d,e,c[a+1],12,-389564586),e=k(e,f,b,d,c[a+2],17,606105819),d=k(d,e,f,b,c[a+3],22,-1044525330),b=k(b,d,e,f,c[a+4],7,-176418897),f=k(f,b,d,e,c[a+5],12,1200080426),e=k(e,f,b,d,c[a+6],17,-1473231341),d=k(d,e,f,b,c[a+7],22,-45705983),b=k(b,d,e,f,c[a+8],7,1770035416),f=k(f,b,d,e,c[a+9],12,-1958414417),e=k(e,f,b,d,c[a+10],17,-42063),d=k(d,e,f,b,c[a+11],22,-1990404162),b=k(b,d,e,f,c[a+12],7,1804603682),f=k(f,b,d,e,c[a+13],12,-40341101),e=k(e,f,b,d,c[a+14],17,-1502002290),d=k(d,e,f,b,c[a+15],22,1236535329),b=m(b,d,e,f,c[a+1],5,-165796510),f=m(f,b,d,e,c[a+6],9,-1069501632),e=m(e,f,b,d,c[a+11],14,643717713),d=m(d,e,f,b,c[a],20,-373897302),b=m(b,d,e,f,c[a+5],5,-701558691),f=m(f,b,d,e,c[a+10],9,38016083),e=m(e,f,b,d,c[a+15],14,-660478335),d=m(d,e,f,b,c[a+4],20,-405537848),b=m(b,d,e,f,c[a+9],5,568446438),f=m(f,b,d,e,c[a+14],9,-1019803690),e=m(e,f,b,d,c[a+3],14,-187363961),d=m(d,e,f,b,c[a+8],20,1163531501),b=m(b,d,e,f,c[a+13],5,-1444681467),f=m(f,b,d,e,c[a+2],9,-51403784),e=m(e,f,b,d,c[a+7],14,1735328473),d=m(d,e,f,b,c[a+12],20,-1926607734),b=n(b,d,e,f,c[a+5],4,-378558),f=n(f,b,d,e,c[a+8],11,-2022574463),e=n(e,f,b,d,c[a+11],16,1839030562),d=n(d,e,f,b,c[a+14],23,-35309556),b=n(b,d,e,f,c[a+1],4,-1530992060),f=n(f,b,d,e,c[a+4],11,1272893353),e=n(e,f,b,d,c[a+7],16,-155497632),d=n(d,e,f,b,c[a+10],23,-1094730640),b=n(b,d,e,f,c[a+13],4,681279174),f=n(f,b,d,e,c[a],11,-358537222),e=n(e,f,b,d,c[a+3],16,-722521979),d=n(d,e,f,b,c[a+6],23,76029189),b=n(b,d,e,f,c[a+9],4,-640364487),f=n(f,b,d,e,c[a+12],11,-421815835),e=n(e,f,b,d,c[a+15],16,530742520),d=n(d,e,f,b,c[a+2],23,-995338651),b=p(b,d,e,f,c[a],6,-198630844),f=p(f,b,d,e,c[a+7],10,1126891415),e=p(e,f,b,d,c[a+14],15,-1416354905),d=p(d,e,f,b,c[a+5],21,-57434055),b=p(b,d,e,f,c[a+12],6,1700485571),f=p(f,b,d,e,c[a+3],10,-1894986606),e=p(e,f,b,d,c[a+10],15,-1051523),d=p(d,e,f,b,c[a+1],21,-2054922799),b=p(b,d,e,f,c[a+8],6,1873313359),f=p(f,b,d,e,c[a+15],10,-30611744),e=p(e,f,b,d,c[a+6],15,-1560198380),d=p(d,e,f,b,c[a+13],21,1309151649),b=p(b,d,e,f,c[a+4],6,-145523070),f=p(f,b,d,e,c[a+11],10,-1120210379),e=p(e,f,b,d,c[a+2],15,718787259),d=p(d,e,f,b,c[a+9],21,-343485551),b=h(b,g),d=h(d,l),e=h(e,q),f=h(f,r);c=[b,d,e,f];g="";for(a=0;a<32*c.length;a+=8)g+=String.fromCharCode(c[a>>5]>>>a%32&255);return g;};(function(){var audio,computeHash,encodeWAV,finishAudio,initializeAudio,interleave,mergeBuffers,monitor,pushAudio,trackedFiles,updateMonitoredFiles,writeString;trackedFiles={};audio={left:[],right:[],length:0,sampleRate:0};self.addEventListener('message',function(e){switch(e.data.action){case 'compute-hash':return computeHash(e.data);case 'monitor-status':return monitor(e.data.hash);case 'initialize-audio':return initializeAudio(e.data);case 'push-audio':return pushAudio(e.data);case 'finish-audio':return finishAudio(e.data);}},false);initializeAudio=function(e){if(e.sampleRate==null)e.sampleRate=audio.sampleRate;return audio={left:[],right:[],length:0,sampleRate:e.sampleRate};};pushAudio=function(e){audio.left.push(e.left);audio.right.push(e.right);return audio.length+=e.left.length;};finishAudio=function(e){var blob,interleaved,left,right,wav;left=mergeBuffers(audio.left,audio.length);right=mergeBuffers(audio.right,audio.length);interleaved=interleave(left,right);wav=encodeWAV(interleaved);blob=new Blob([wav],{type:'audio/x-wav'});return self.postMessage({execute:""+e.callback+"(e.data.data)",data:blob});};computeHash=function(e){var hash;hash=btoa(rstr_md5(e.data)).substr(0,12);hash=hash.replace(/\+/g,'-');hash=hash.replace(/\//g,'_');return self.postMessage({execute:""+e.callback+"('"+e.id+"', '"+hash+"')"});};monitor=function(e){trackedFiles[e]={hash:e,status:'pending'};if(Object.keys(trackedFiles).length===1)return setTimeout(updateMonitoredFiles,1000);};updateMonitoredFiles=function(){var f,v,_;_=[];for(f in trackedFiles){v=trackedFiles[f];_.push(f);}return API.checkStatus(_.join(','),function(result){var hash,item,_ref;for(hash in result){item=result[hash];if(trackedFiles[hash].status!==item.status){trackedFiles[hash].status=item.status;self.postMessage({event:'file-status-change',hash:hash,status:item.status,file:item.file});if((_ref=item.status)!=='preparing'&&_ref!=='uploading'&&_ref!=='pending'&&_ref!=='processing'&&_ref!=='ready')delete trackedFiles[hash];}}if(Object.keys(trackedFiles).length>0)return setTimeout(updateMonitoredFiles,1000);});};mergeBuffers=function(buffers,length){var buffer,offset,result,_i,_len;result=new Float32Array(length);offset=0;for(_i=0,_len=buffers.length;_i<_len;_i++){buffer=buffers[_i];result.set(buffer,offset);offset+=buffer.length;}return result;};interleave=function(left,right){var i,j,length,result;length=left.length+right.length;result=new Float32Array(length);i=0;j=0;while(i<length){result[i++]=left[j];result[i++]=right[j];j++;}return result;};writeString=function(view,offset,string){var i,_i,_ref,_results;_results=[];for(i=_i=0,_ref=string.length;0<=_ref?_i<=_ref:_i>=_ref;i=0<=_ref?++_i:--_i)_results.push(view.setUint8(offset+i,string.charCodeAt(i)));return _results;};encodeWAV=function(samples){var buffer,view;buffer=new ArrayBuffer(44+samples.length*2);view=new DataView(buffer);writeString(view,0,'RIFF');view.setUint32(4,32+samples.length*2,true);writeString(view,8,'WAVE');writeString(view,12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,2,true);view.setUint32(24,audio.sampleRate,true);view.setUint32(28,audio.sampleRate*4,true);view.setUint16(32,4,true);view.setUint16(34,16,true);writeString(view,36,'data');view.setUint32(40,samples.length*2,true);floatTo16BitPCM(view,44,samples);return view;};function floatTo16BitPCM(output,offset,input){for(var i=0;i<input.length;i++,offset+=2){var s=Math.max(-1,Math.min(1,input[i]));output.setInt16(offset,s<0?s*0x8000:s*0x7FFF,true);}};}).call(this);