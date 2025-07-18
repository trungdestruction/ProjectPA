import { _decorator, bezier, Component, easing, instantiate, Node, randomRange, tween, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Util')
export class Util extends Component {
    public static random(minInclusive: number, maxInclusive: number): number {
        return Math.floor(Math.random() * (maxInclusive - minInclusive + 1)) + minInclusive;
    }

    public static getLocalPosition(worldPosition: Vec3, localNode: Node): Vec3 {
        let fakeNode = new Node();
        localNode.parent.addChild(fakeNode);
        fakeNode.setWorldPosition(worldPosition);
        let localPos = fakeNode.getPosition();
        fakeNode.destroy();
        return localPos;
    }

    
    public static popupNode(targetNode: Node, scale: number = 1, duration: number = 0.3, callBack = null) {
        targetNode.setScale(v3(0,0))
        targetNode.active = true;
        tween(targetNode).to(duration, {scale: v3(scale, scale)}, {easing: easing.smooth}).call(()=>{
            if(callBack) callBack();
        }).start();
    }

    public static colabNode(targetNode: Node, scale: number = 0, duration: number = 0.3, callBack = null) {
        let initScale = targetNode.getScale();
        tween(targetNode).to(duration, {scale: v3(scale, scale)}, {easing: easing.smooth}).call(()=>{
            targetNode.setScale(initScale)
            targetNode.active = false;
            if(callBack) callBack();
        }).start();
    }
    public static PlayDooberAnimation(itemToAnimate: Node,
        containerNode: Node, sourceNode: Node, destinationNode: Node,
        moveRange: number = 200, numObjects: number = 10, animDuration: number = 0.25, upDown: boolean = true, angle = 0) {

        let sp: Vec3 = sourceNode.worldPosition
        let ep: Vec3 = destinationNode.worldPosition

        //mid point of bot these points.
        let cp: Vec3 = v3()
        Vec3.add(cp, sp, ep);
        cp.multiplyScalar(0.5)
        cp.y += (upDown) ? 1 * moveRange : -1 * moveRange;

        for (var i = 0; i < numObjects; i++) {
            let coin = instantiate(itemToAnimate)
            coin.worldPosition = sourceNode.worldPosition

            tween(coin)
                .delay(i * 0.125 + randomRange(0.1, 0.125))
                .call(() => { containerNode.addChild(coin) })
                .to(animDuration, { worldPosition: ep , angle: angle}, {
                    easing: easing.expoIn,
                    onUpdate(target: Node, ratio) {
                        let x = bezier(sp.x, cp.x, cp.x, ep.x, ratio)
                        let y = bezier(sp.y, cp.y, cp.y, ep.y, ratio)
                        target.setWorldPosition(x, y, target.worldPosition.z)
                        target.setWorldRotationFromEuler(0, 0, coin.angle)
                    },
                })
                .call(() => { coin.removeFromParent() })
                .start()
        }
    }
}


