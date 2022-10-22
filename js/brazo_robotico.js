import * as THREE from "../lib/three.module.js";
class BrazoRobotico{

    constructor(wireframe){
        this.root =  this.base(wireframe);
        this.brazo = this.brazo(wireframe);
        this.anteBrazo = this.anteBrazo(wireframe);
        this.pinzaIzq = this.pinza(wireframe);
        this.pinzaIzq.position.y = -10
        
        this.pinzaDer = this.pinza(wireframe);
        this.pinzaDer.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
        this.pinzaDer.position.y = 10
    }

    changeWireframe(wireframe){
        this.root.material.wireframe = wireframe;
        this.brazo.material.wireframe = wireframe;
        this.anteBrazo.material.wireframe = wireframe;
        this.pinzaIzq.material.wireframe = wireframe;
        this.pinzaDer.material.wireframe = wireframe;
    }

    model(){
        this.root.add(this.brazo);
        this.brazo.add(this.anteBrazo);
        this.anteBrazo.children[4].add(this.pinzaIzq);
        this.anteBrazo.children[4].add(this.pinzaDer);
        return this.root;
    }

    base(wireframe){
        //const baseMaterial = new THREE.MeshNormalMaterial({wireframe:wireframe});
        const result = new THREE.Mesh(new THREE.CylinderGeometry(50,50,15,50), this.texturaMetalicaBrillante('grey'));
        result.castShadow = result.receiveShadow = true;
        result.rotation.y = 0;
        result.position.y = 10;
        return result;
    }

    rotateBase(value){
        this.root.rotation.y = value*Math.PI/180; 
    }

    texturaMetalica(color){
        const loader = new THREE.TextureLoader().load("../iluminacion.github.io/textures/brazo.jpg");
        return new THREE.MeshLambertMaterial({color:color,map:loader});
    }

    texturaMetalicaBrillante(color){
        const loader = new THREE.TextureLoader().load("../iluminacion.github.io/textures/brazo.jpg");
        return new THREE.MeshPhongMaterial({color:color,map:loader, shininess:100});
    }

    entornoBrazo(){
        const path = '../iluminacion.github.io/textures/habitacion/';
        const format = '.jpg';
        const entorno = [ path+"posx"+ format, path+"negx"+ format,
                      path+"posy"+ format, path+"negy"+ format,
                      path+"posz"+ format, path+"negz"+ format];
        return new THREE.CubeTextureLoader().load(entorno);
    }
    
    brazo(wireframe){
        const matesfera = new THREE.MeshPhongMaterial({color:'white',
                                                   specular:'gray',
                                                   shininess: 100,
                                                   envMap: this.entornoBrazo() });
        const texturaBrazo = this.texturaMetalica('grey');
        //const baseMaterial = new THREE.MeshNormalMaterial({wireframe:wireframe});
        const cylinder = new THREE.Mesh( new THREE.CylinderGeometry(20,20,18,20), texturaBrazo );
        cylinder.castShadow = cylinder.receiveShadow = true;
        cylinder.rotation.z = 90*Math.PI/180;
        //cylinder.add(new THREE.AxesHelper(120));
        const rectangle = new THREE.Mesh( new THREE.BoxGeometry(12,120,18,2), texturaBrazo);
        rectangle.rotation.z = 90*Math.PI/180;
        rectangle.position.x = 60;
        rectangle.castShadow = rectangle.receiveShadow = true;
        cylinder.add(rectangle);
        const sphere = new THREE.Mesh( new THREE.SphereGeometry(20,20,10), matesfera );
        sphere.position.y = -60;
        sphere.castShadow = sphere.receiveShadow = true;
        rectangle.add(sphere);
        return cylinder;
    }

    rotateBrazo(value){
        this.brazo.rotation.x = value*Math.PI/180; 
    }

    anteBrazo(wireframe){
        const textura = this.texturaMetalica('yellow');
        // const textura = new THREE.MeshNormalMaterial({wireframe:wireframe});
        const cylinder = new THREE.Mesh( new THREE.CylinderGeometry(22,22,6,20), textura );
        cylinder.rotation.z = 90*Math.PI/180;
        cylinder.castShadow = cylinder.receiveShadow = true;

        const rectangle1 = new THREE.Mesh( new THREE.BoxGeometry(4,80,4,2), textura );
        rectangle1.castShadow = rectangle1.receiveShadow = true;

        const rectangle2 = rectangle1.clone();
        const rectangle3 = rectangle1.clone();
        const rectangle4 = rectangle1.clone();
        //rectangle.rotation.z = Math.PI/180;
        rectangle1.position.y = -40;
        rectangle1.position.x = 7;
        rectangle1.position.z = 10;
    
        rectangle2.position.y = -40;
        rectangle2.position.x = -7;
        rectangle2.position.z = 10;
    
        rectangle3.position.y = -40;
        rectangle3.position.x = -7;
        rectangle3.position.z = -10;
        //rectangle3.position.x = -10;

        rectangle4.position.y = -40;
        rectangle4.position.x = 7;
        rectangle4.position.z = -10;

        //rectangle4.position.x = 10;
        cylinder.add(rectangle1);
        cylinder.add(rectangle2);
        cylinder.add(rectangle3);
        cylinder.add(rectangle4);
        const cylinder1 = new THREE.Mesh( new THREE.CylinderGeometry(15,15,40,20), this.texturaMetalicaBrillante('yellow') );
        cylinder1.castShadow = cylinder1.receiveShadow = true;
        cylinder1.position.y = -80;
        //cylinder1.rotation.x = 90*Math.PI/180;
        cylinder1.rotation.z = 90*Math.PI/180;
        //cylinder1.rotation.x = 90*Math.PI/180;
        cylinder.add(cylinder1);
        cylinder.position.x = 120;
        //cylinder1.add(new THREE.AxesHelper(120));
        return cylinder;
    }

    rotateAnteBrazo(value){
        this.anteBrazo.rotation.x = value*Math.PI/180; 
    }

    rotateAnteBrazo1(value){
        this.anteBrazo.rotation.y = value*Math.PI/180; 
    }

    pinza(wireframe){
        const geometry = new THREE.BufferGeometry();
        // create a simple square shape. We duplicate the top left and bottom right
        // vertices because each vertex needs to appear once per triangle.
        var vertices = new Float32Array( [      
            //Left
            1.0, 0.7, 0.0,
            1.0, 0.3, 0.0,
            0.0, 0.0, 0.0,
            0.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            1.0, 0.7, 0.0,
    
            //rigth horario
            0.0, 0.0, 1.0,
            1.0, 0.3, 0.5,
            1.0, 0.7, 0.5,
            1.0, 0.7, 0.5,
            0.0, 1.0, 1.0,
            0.0, 0.0, 1.0,
            
            //top
            0.0, 1.0, 1.0,
            1.0, 0.7, 0.5,
            1.0, 0.7, 0.0,
            1.0, 0.7, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 1.0,
            
            //botton hora
            1.0, 0.3, 0.0,
            1.0, 0.3, 0.5,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 0.0,
            1.0, 0.3, 0.0,
            
            //back
            0.0, 0.0, 1.0,
            0.0, 1.0, 1.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 0.0,
            0.0, 0.0, 1.0,
    
            //front anti
            1.0, 0.7, 0.0,
            1.0, 0.7, 0.5,
            1.0, 0.3, 0.5,
            1.0, 0.3, 0.5,
            1.0, 0.3, 0.0,
            1.0, 0.7, 0.0,
        ] );
        var dim = new Array(36).fill([19, 20, 4]).flat();
        vertices = vertices.map((value,index)=>{
            return value*dim[index];
        });

        const normales = [];
        for (let i =0; i< vertices.length; i += 9) {
            const verx = Array.from(vertices.slice(i,i+9).values());
            for(var j = 0; j<(verx.length); j +=3 ){
                const v1 =  new THREE.Vector3(verx.at(j-3)-verx.at(j), verx.at(j-2)-verx.at(j+1), verx.at(j-1)-verx.at(j+2));
                let v2;
                if(j==6){
                    v2 =  new THREE.Vector3(verx.at(j-6)-verx.at(j), verx.at(j-5)-verx.at(j+1), verx.at(j-4)-verx.at(j+2));
                }else{
                    v2 =  new THREE.Vector3(verx.at(j+3)-verx.at(j), verx.at(j+4)-verx.at(j+1), verx.at(j+5)-verx.at(j+2));
                }
                const c = new THREE.Vector3().crossVectors(v2,v1).normalize();
                normales.push(c.x)
                normales.push(c.y)
                normales.push(c.z)
            }
        }
        // itemSize = 3 because there are 3 values (components) per vertex
        geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        //geometry.computeVertexNormals()
        geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute(normales,3));
        //const pinzaMaterial = new THREE.MeshNormalMaterial( { wireframe:wireframe} );
        const mesh = new THREE.Mesh( geometry, this.texturaMetalica('rgb(15,14,19)') );
        mesh.castShadow = mesh.receiveShadow = true;
        mesh.position.x = 9.5;
        mesh.position.y = -10;
        mesh.position.z = -2;
        const boxGeometry = new THREE.Mesh( new THREE.BoxGeometry(19,20,4), this.texturaMetalica('rgb(15,14,19)'));
        boxGeometry.castShadow = boxGeometry.receiveShadow = true;
        boxGeometry.add(mesh);
        // boxGeometry.position.y =20;
        //boxGeometry.add(new THREE.AxesHelper(60))
        boxGeometry.position.z = 10;
        boxGeometry.rotation.x =90*Math.PI/180;
        boxGeometry.rotation.z =90*Math.PI/180;
        //boxGeometry.rotation.x =90*Math.PI/180;
        //boxGeometry.add(new THREE.AxesHelper(120));
        return boxGeometry;
    }

    rotatePinza(value){
        this.anteBrazo.children[4].rotation.x = value*Math.PI/180; 
    }

    openPinza(value){
        this.pinzaIzq.position.y = -value; 
        this.pinzaDer.position.y = value; 
    }
}

export {BrazoRobotico};