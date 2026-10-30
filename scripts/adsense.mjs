// Keep the public export exception limited to the publisher supplied by the owner.
export const adsenseScriptSrc='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9360996257353318';
export function isAdSenseScript(attributes){
 return /\basync(?:\s|=|$)/i.test(attributes)&&attributes.match(/\bsrc="([^"]+)"/i)?.[1]===adsenseScriptSrc&&/\bcrossorigin="anonymous"/i.test(attributes);
}
