'use strict';
(function(){
  var state=window.homeInstallState;
  var ua=navigator.userAgent||'';
  var ios=/iPad|iPhone|iPod/i.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  var android=/Android/i.test(ua);
  var requested=new URLSearchParams(location.search).get('install');
  var platform=ios?'ios':android?'android':(requested==='ios'||requested==='android'?requested:'desktop');
  var iosGuide=document.getElementById('iosGuide'), androidGuide=document.getElementById('androidGuide'), desktopGuide=document.getElementById('desktopGuide');
  var button=document.getElementById('installButton'), status=document.getElementById('installStatus');
  iosGuide.hidden=platform!=='ios'; androidGuide.hidden=platform!=='android'; desktopGuide.hidden=platform!=='desktop'; button.hidden=platform!=='android';
  function installed(){state.event=null;state.installed=true;status.textContent='홈 화면에 추가되었습니다.';button.hidden=true;}
  function ready(){if(!state.installed&&state.event)status.textContent='설치 준비가 되었습니다. 버튼을 눌러 직접 확인해 주세요.';}
  window.addEventListener('homeinstallready',ready);window.addEventListener('homeinstallcomplete',installed);
  if(state.installed)installed(); else ready();
  button.addEventListener('click',async function(){
    if(state.installed)return;
    var event=state.event;state.event=null;
    if(!event){status.textContent='설치 준비 중이거나 이 브라우저에서 버튼 설치를 지원하지 않습니다. 아래 브라우저 메뉴를 이용해 주세요.';return;}
    try{
      var result=await event.prompt();
      var choice=result&&result.outcome?result:await event.userChoice;
      if(state.installed)return;
      status.textContent=choice&&choice.outcome==='accepted'?'설치 요청을 확인했습니다. 설치 완료 여부는 브라우저에서 확인해 주세요.':'설치가 취소되었습니다. 다시 추가하려면 아래 브라우저 메뉴를 이용해 주세요.';
    }catch(e){if(!state.installed)status.textContent='설치 창을 열지 못했습니다. 아래 브라우저 메뉴를 이용해 주세요.';}
  });
  if('serviceWorker' in navigator)navigator.serviceWorker.register('./home-sw.js').catch(function(){});
})();
