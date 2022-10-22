import * as THREE from "../lib/three.module.js";
class Habitacion{
    constructor(textureUrl){
        this.url = textureUrl;
    }

    model(){
        const path = this.url;
        const format = '.jpg';
        let loader = new THREE.TextureLoader();
        let materialArray = [
            new THREE.MeshBasicMaterial( {side:THREE.BackSide, map: loader.load(path + 'posx' + format) } ),
            new THREE.MeshBasicMaterial( {side:THREE.BackSide, map: loader.load(path + 'negx' + format,) } ),
            new THREE.MeshBasicMaterial( {side:THREE.BackSide, map: loader.load(path + 'posy' + format) } ),
            new THREE.MeshBasicMaterial( {side:THREE.BackSide, map: loader.load(path + 'negy' + format,) } ),
            new THREE.MeshBasicMaterial( {side:THREE.BackSide, map: loader.load(path + 'posz' + format) } ),
            new THREE.MeshBasicMaterial( {side:THREE.BackSide, map: loader.load(path + 'negz' + format,) } ),
        ];
        const habitacion =  new THREE.Mesh( new THREE.BoxGeometry(1500,1000,1500),materialArray);
        habitacion.position.y = 490;
        return  habitacion;
    }
}

export {Habitacion}