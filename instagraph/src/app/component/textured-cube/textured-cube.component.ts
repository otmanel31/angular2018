import { Component, OnInit, ElementRef, AfterViewInit, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';

import * as THREE from 'three';import { ImageServicesService } from '../../services/image-services.service';

@Component({
  selector: 'app-textured-cube',
  templateUrl: './textured-cube.component.html',
  styleUrls: ['./textured-cube.component.css']
})
export class TexturedCubeComponent implements OnInit, AfterViewInit {

  // on declare une camera perspective (skyrim) classque ou isometrique (stratégie sims ... ) c a dire ss perspective  
  private camera: THREE.PerspectiveCamera;
  // structure geometrique cad point, face etc de notre cube
  private cube: THREE.Mesh; // la definition des point (strcutre des poinr ds lelement placé a un endroit ds le monde) 
  private scene: THREE.Scene // c ici ou on place ts nos objet => monde rendu en 3d avc camera lumiere etc ..... 
  private renderer: THREE.WebGLRenderer // composant qui fait le rendu 3D avc la camera sur la scene ==> MOTEUR DE RENDU 3d => variante utilsant wbgl donc acceleration GPU

  // configuration de la rotation du cube
  @Input()
  public rotationSpeedX: number = 0.005; // valeur qui ns font tourner pas trop vite
  @Input()
  public rotationSpeedY: number = 0.01;
  @Input()
  public size: number = 200; // taille du cube arbitraire ... 
  @Input()
  public textureId: number = 24; // dernier input pour le cube => image qu on va plaquer sur une des faces du cube

  // proprieté de la scene 
  @Input()
  public cameraZ: number = 400; // distance d ela camera par rapport a la scene

  @Input()
  public fieldOfView: number = 70;// vue plus ou moins retreci ou etendu donc angle de vision
  @Input()
  public nearclippingPlane: number = 1; //MIN
  @Input()
  public farclippingPlane: number = 1000; // MAX  rendu par ex de quelques chose de la distance de la camera a un certain point => camera --- point de rendu  -- objet

  // declaration canvas : element natif donc balise quon place ds notre composant
  @ViewChild('canvas')
  private canvasRef: ElementRef;

  // gette en type script
  public get canvas(): HTMLCanvasElement{
    return this.canvasRef.nativeElement; // => retourne le html du canvas
  }

  constructor(private imageRepo: ImageServicesService) { }

  ngOnInit() {

  }
  // 1°/ fonction qui permet de creer un cube

  private createCube():void{
    if (!this.textureId){
      this.cube = null;
      return;
    }
    // chargement de limage en texture donc ajout image ds objet avc beaucoup d'autre chose specifique
    let texture = new THREE.TextureLoader().load(this.imageRepo.getImgUrl(this.textureId));
    // va combiner une texture avc une maniere de le rendre donc materiau sur la surface de lobjet effet ( coomme flash du photograph lors dune photo)
    let material = new THREE.MeshBasicMaterial({map:texture}); // texture + effet phisique visuel de rendu (reflet .... )

    //creation du cube ou structure (points/faces) de notre objet cube
    let geometry = new THREE.BoxBufferGeometry(this.size, this.size, this.size);
    // on utilise ce squellete (geometry) et on y appliqyue un ou des materiau pour l'habiller
    // notre mesh est pret à lemploi
    this.cube = new THREE.Mesh(geometry, material);
    // on le place sur la scene
    console.log("ajout ds la scene")
    this.scene.add(this.cube);
  }

  // 2°/ creation de la scene
  private createScene():void{
    this.scene = new THREE.Scene;

    // creation de la camera  et on la place ds la scene
    this.camera = new THREE.PerspectiveCamera(this.fieldOfView, this.getAspectRatio(), this.nearclippingPlane, this.farclippingPlane);
    // ici on place la camera (devant le cube qui est a 0.001)
    // si z augmente, eloignement de la camera par rapport au cube
    this.camera.position.z = this.cameraZ;
  }
  // 3°/ aspect ratio = rapport entre resolution vertical et horizontale 
  // mise ne place au préalable du canvas 
  public getAspectRatio(): number{
    // calcul du ration horizontale / vertical
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }


  public onResize(event: any):void{
    // redimensionnement de la fentre donc calcul nouvel aspect ratio
    this.camera.aspect  = this.getAspectRatio();
    // maj de la projection 3D -> 2D en fonction
    this.camera.updateProjectionMatrix(); // => matrice recalcule tte les formule de rendu ....
    // maj de la taille de la fenetre de rendu
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight); 
  }

  // 4 °/ animation du cube rotation par exemoke
  private animateCube():void{
    if(this.cube != null){
      this.cube.rotation.x += this.rotationSpeedX;
      this.cube.rotation.y += this.rotationSpeedY;
    }
  }

  // 5° / boucle qui se repete a chaque rafraichissement de limg 3D en gros 60 fois par sec
  private startRenderingLoop(): void{
    // on cree le moteur de rendu 
    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
    // ratio des pixel de l'ecran
    this.renderer.setPixelRatio(devicePixelRatio); // devicPixelRation => ds lobjet window propieté en lecture seule
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight); // set taille fentre de rendu

    // maintenant le ùoteur de renedu est pret
    // EXPLICATION BLOUCLE DE RENDU VOIR COURS PAPIER
    let component: TexturedCubeComponent = this; // reference vers notre propre component => pb closure et plus acces au this dans la callback
    (function render(){ // voici la boucle
      // je lui demande de rzpeler ma fonction render quand il faufra reafraichir la page
      requestAnimationFrame(render);
      component.animateCube(); // a chaque refresh on fait tourner le cube
      // et faire le rendu
      component.renderer.render(component.scene, component.camera);
    })();
  }

  // 6°/ enfin demarrage => une fois que l ehtml est cree donc appel du afterview init.
  ngAfterViewInit(): void {
    // appper unfois que le html et les injection de contenu parent sint effective
    // on cree la scene
    this.createScene();
     // on cree le cube
    this.createCube()
     // on demarre le rendering view
    this.startRenderingLoop();
  }
}
