// Shared, explicit camera action: looking at a work never moves the visitor.
export const WORKBENCH_TEXT={
 en:{work:'Work in the room',read:'Read the full argument',face:'Face the work',hint:'The room stays visible. Close these controls to walk.',vectors:'Blue: velocity. Terracotta: restoring force. Arrows share a display scale of 0.4; the formula gives their physical meaning.'},
 de:{work:'Im Raum experimentieren',read:'Das vollständige Argument lesen',face:'Zum Werk schauen',hint:'Der Raum bleibt sichtbar. Zum Gehen diese Bedienung schließen.',vectors:'Blau: Geschwindigkeit. Terrakotta: rückstellende Kraft. Darstellungsmaßstab beider Pfeile: 0,4; ihre physikalische Bedeutung steht in der Formel.'},
 fa:{work:'آزمایش در اتاق',read:'خواندن استدلال کامل',face:'رو به اثر',hint:'اتاق قابل دیدن می‌ماند. برای راه رفتن این پنل را ببندید.',vectors:'آبی: سرعت. سفالی: نیروی بازگرداننده. مقیاس نمایشی هر دو پیکان ۰٫۴ است؛ معنای فیزیکی آن‌ها در فرمول آمده است.'},
 cs:{work:'Zkoumat v místnosti',read:'Číst celý argument',face:'Podívat se na dílo',hint:'Místnost zůstává viditelná. Pro chůzi zavřete ovládání.',vectors:'Modrá: rychlost. Terakota: vratná síla. Obě šipky mají zobrazovací měřítko 0,4; jejich fyzikální význam určuje vzorec.'}
};
export function faceRoomWork(M,T,object){
 if(!object)return;
 object.updateWorldMatrix(true,false);
 const target=object.getWorldPosition(new T.Vector3()),p=M.player;
 const distance=Math.hypot(p.x-target.x,p.z-target.z);
 if(distance<.05)return;
 p.yaw=Math.atan2(p.x-target.x,p.z-target.z);
 // Aim below the work so it remains above the compact controls on a phone.
 const drop=globalThis.innerWidth<=800?1.4:.7;
 p.pitch=Math.max(-.8,Math.min(.75,Math.atan2(target.y-drop-p.y,distance)));
 // Walking is paused by the dialog, so the normal camera update is paused too.
 M.camera?.rotation.set(p.pitch,p.yaw,0,'YXZ');
 M.camera?.updateMatrixWorld();
 M.clearMovement();
}
