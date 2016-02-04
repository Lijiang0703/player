/**
 * Created by lijiang on 16/1/25.
 */
$(function(){
    var renderer = new THREE.WebGLRenderer({
        canvas:document.getElementById('mainCanvas')
    });
    //render渲染器
    //var renderer = new THREE.WebGLRenderer();
    //renderer.setSize(400, 300);
    //$('body').append(renderer.domElement);
    renderer.setClearColor(0x000000);
    //scene场景
    var scene = new THREE.Scene();
    //camera
    //var camera = new THREE.PerspectiveCamera(60, 400 / 300, 1, 10);
    var camera = new THREE.OrthographicCamera(-2, 2, 1.5, -1.5, 1, 10);
    camera.position.set(4,-3,5);
    camera.lookAt(new THREE.Vector3(0,0,0));
    scene.add(camera);
    //cube
    var cube = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1,2,2,3), new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
    }));
    scene.add(cube);
    //sphere
    var sphere = new THREE.SphereGeometry(3,8,6);
    //scene.add(sphere);
    //planeGeometry
    var plane = new THREE.PlaneGeometry(2, 4);
    //scene.add(plane);
    renderer.render(scene,camera);
});