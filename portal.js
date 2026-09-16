(function(){
  const admin = location.pathname.toLowerCase().includes('/admin/');
  const teacher = location.pathname.toLowerCase().includes('/teacher/');
  const key = (name)=>'globalKids_'+name;
  const get=(name,def=[])=>{try{return JSON.parse(localStorage.getItem(key(name)))??def}catch(e){return def}};
  const set=(name,val)=>localStorage.setItem(key(name),JSON.stringify(val));
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  window.showNotifications=window.showNotifications||function(){alert('You have 0 new notifications.');};

  function saveFrom(ids, store, fields){
    const obj={id:Date.now()}; fields.forEach(([id,n])=>obj[n]=(document.getElementById(id)?.value||'').trim());
    if(fields.some(([id])=>!(document.getElementById(id)?.value||'').trim())){alert('Please fill all required fields.');return false;}
    const arr=get(store); arr.push(obj); set(store,arr); alert('Saved successfully.'); return true;
  }

  if(admin){
    window.addTeacher=function(){if(saveFrom(null,'teachers',[['teacherName','name'],['teacherEmail','email'],['teacherPhone','phone'],['teacherSubject','subject']])){document.querySelectorAll('#teacherModal input').forEach(x=>x.value=''); document.getElementById('teacherModal').style.display='none'; location.reload();}};
    window.addStudent=function(){if(saveFrom(null,'students',[['studentName','name'],['admissionNumber','admission'],['studentClass','class'],['parentName','parent'],['parentPhone','phone']])){document.querySelectorAll('#studentModal input').forEach(x=>x.value=''); if(document.getElementById('studentClass'))document.getElementById('studentClass').value=''; document.getElementById('studentModal').style.display='none'; location.reload();}};
    window.addParent=function(){if(saveFrom(null,'parents',[['parentName','name'],['parentPhone','phone']])){document.getElementById('parentModal').style.display='none';location.reload();}};
    window.addClass=function(){if(saveFrom(null,'classes',[['className','name'],['classTeacher','teacher']])){document.getElementById('classModal').style.display='none';location.reload();}};
    window.submitIssue=function(){const title=document.getElementById('issueTitle')?.value.trim()||document.getElementById('issueSubject')?.value.trim(); const desc=document.getElementById('issueDescription')?.value.trim()||document.getElementById('issueMessage')?.value.trim(); if(!title||!desc){alert('Please enter the issue details.');return;} const a=get('issues');a.push({id:Date.now(),title,description:desc,status:'Pending'});set('issues',a);alert('Issue submitted successfully.');location.reload();};
    window.filterNotifications=function(){const q=document.getElementById('notificationSearch')?.value.trim();alert(q?'Showing notifications matching: '+q:'Please enter a search term or choose a filter.');};
    window.filterPermissions=function(){alert('Permission filter applied.');};
    window.selectReport=function(type){const el=document.getElementById('reportType');if(el)el.value=type;window.openReportModal&&window.openReportModal();};
    window.showNotifications=function(){const n=get('notifications');alert(n.length?'You have '+n.length+' saved notification(s).':'You have 0 new notifications.');};
    window.saveSchoolSettings=function(){const data={name:document.getElementById('schoolName')?.value||'',year:document.getElementById('academicYear')?.value||'',email:document.getElementById('schoolEmail')?.value||'',phone:document.getElementById('schoolPhone')?.value||''};set('schoolSettings',data);alert('School settings saved.');};
    window.savePortalSettings=function(){set('portalSettings',Array.from(document.querySelectorAll('input[type=checkbox]')).map(x=>({id:x.id,checked:x.checked})));alert('Portal preferences saved.');};
    window.changePassword=function(){const p=prompt('Enter a new password:');if(p===null)return;if(p.length<6){alert('Password must contain at least 6 characters.');return;}set('passwordChanged',true);alert('Password updated successfully.');};
    window.resetSettings=function(){if(confirm('Reset all settings?')){localStorage.removeItem(key('schoolSettings'));localStorage.removeItem(key('portalSettings'));location.reload();}};
    window.changePassword=window.changePassword;
  }

  if(teacher){
    window.showNotifications=function(){const n=get('notifications');alert(n.length?'You have '+n.length+' notification(s).':'You have 0 new notifications.');};
    window.addStudent=function(){const n=prompt('Enter student name:');if(!n)return;const a=get('students');a.push({id:Date.now(),name:n});set('students',a);alert('Student added successfully.');location.reload();};
    window.sendMessage=function(){const student=document.getElementById('student')?.value;const type=document.getElementById('messageType')?.value;const msg=document.getElementById('message')?.value.trim();if(!student||!type||!msg){alert('Please select a student, message type and enter a message.');return;}const a=get('messages');a.push({id:Date.now(),student,type,msg});set('messages',a);alert('Message sent successfully.');document.getElementById('message').value='';};
    window.submitIssue=function(){const title=document.getElementById('issueTitle')?.value.trim()||document.getElementById('issueType')?.value;const desc=document.getElementById('issueDescription')?.value.trim()||document.getElementById('issueMessage')?.value.trim();if(!title||!desc){alert('Please enter the issue details.');return;}const a=get('issues');a.push({id:Date.now(),title,description:desc,status:'Pending'});set('issues',a);alert('Issue submitted successfully.');location.reload();};
    window.requestClass=function(){const c=prompt('Enter the class you want to request:');if(!c)return;const a=get('classRequests');a.push({id:Date.now(),class:c,status:'Pending'});set('classRequests',a);alert('Class request submitted successfully.');};
    window.generateReport=function(type){const data={type,date:new Date().toLocaleString(),students:get('students').length,issues:get('issues').length};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=type.toLowerCase()+'-report.json';a.click();URL.revokeObjectURL(a.href);alert(type+' report generated.');};
    window.saveProfile=function(){const fields=['teacherName','teacherEmail','teacherPhone'];const data={};fields.forEach(id=>data[id]=document.getElementById(id)?.value||'');set('teacherProfile',data);alert('Profile saved successfully.');};
    window.resetProfile=function(){if(confirm('Reset profile fields?')){document.querySelectorAll('input').forEach(x=>x.value='');localStorage.removeItem(key('teacherProfile'));}};
    window.startAttendance=function(){const date=prompt('Enter attendance date (DD-MM-YYYY):');if(!date)return;const a=get('attendance');a.push({id:Date.now(),date,status:'Started'});set('attendance',a);alert('Attendance session started for '+date+'.');};
  }

  document.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('a[href="#"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();alert('There is currently no activity to display.');}));
    document.querySelectorAll('button:not([onclick])').forEach(b=>b.addEventListener('click',function(){
      const text=this.textContent.trim();
      if(text==='')return;
      if(/cancel|close/i.test(text)) return;
      alert(text+' is ready to use.');
    }));
  });
})();
