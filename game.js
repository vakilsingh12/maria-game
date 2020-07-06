let config={
 	type:Phaser.AUTO, //auto automatically detect which rendring type is best for your browser

 	scale:{  //scale if a object to give the information of game
 		mode:Phaser.Scale.FIT,//refer phaser.scale.manager for more details
 		width:800,
 		height:600,
 	},
 	backgroundColor : 0xffff11,
    
    
    // in this we have to include some laws of motion and for that phaser provide some physics engine 
    
    physics:{
        default:'arcade',
        // for arcade engine we need to configure few values
        arcade:{
            gravity:{
                     //about gravity we can have gravity along y axis or we can have gravity along x axis but in my case gravity along y axis only 
                y:1000, // we can try different different values but it work fine in my case.
                // more gravity means higher gravitational force
                
                
            },
            // in the physics we can add debug  so that it will show bounding boxes around each body
        debug:false,
            
            //blue lines are for static bodies and pink is for dynamic body
            
            // when object is falling green line showing the direction and megnitude of the velocity.
        }
    },
    
 	scene:{
 		preload:preload,
 		create:create,
 		update:update,
 	}


 };

 let game=new Phaser.Game(config);
let player_config={
 player_speed:500,
    player_jump_speed:-700,
}

 function preload()
 {
 	this.load.image('ground',"Assets/topground.png");//loading the image its an 128*128 image
    this.load.image("sky","Assets/background.png");
    this.load.spritesheet("dude","Assets/dude.png",{frameWidth:32,frameHeight:48});// there are many images in this image but we need to add one only to indicate our player other are for animations only . player is at the mid and 4 left imgaes is for when player moving in the left direction and and right 4 images is for when player moving to right direction.basically in this image we have 9 frames .for these images we need to load in different way using spritesheet and passing frame width and frame height and for finding the each frame width we have to divide the total number of pixel by total number of frame. like 288 px and total frme is 9 then frame width is 32.
     
     
     this.load.image("apple","Assets/apple.png");
     
     this.load.image("ray","Assets/ray.png");
     

 }
 function create()
 {

 	W=game.config.width; //width of the image
 	H=game.config.height; //height of the image
 	
 	//now lets try to create background

 	let background=this.add.sprite(0,0,'sky');
 	background.setOrigin(0,0);
background.displayWidth = W;
     background.depth=-2;
     
     
     
     //now we are going to add sunset functionalities on the top of the background
     let rays=[];
     for(let i=-10;i<=10;
        i++)
         {
     let ray=this.add.sprite(W/2,H-100,'ray');
             
    ray.displayHeight=1.2*H;
    ray.setOrigin(0.5,1);   
     //now we can also reduce the whitness 
     ray.alpha=0.2;
     //we can also rotate
     ray.angle=i*20 ;
    ray.depth=-1;
             
    // display height of ray is not cover full screen for that we have to increase the display height of  the ray as like we did for background to increase the display height for this go to the line 82 and check it out;
           
             // we also have to add ray into rays list
             rays.push(ray);
             
             //now we are going to create tween go to the line 97 and check it out

    }
     this.tweens.add({
         targets:rays,
         props:{
             angle:{
                 value:"+=20",
             },
             
         },
         duration:8000,
         repeat:-1,
     })
     
     
 	// now we are goind to find the coordinates where i want to place this image; 
 	let ground=this.add.tileSprite(0,H-128,W,128,'ground');// if we use only sprite it will place a single image but we use tileSprite then it will place a image repeatadly to the width we will give and height also;
 	ground.setOrigin(0,0);
     
     
     //now we are going to add player in our game and make sure that player follows physics that we have.
     
     //for that we have to load player image which is dude so goto the preload function.
     
     //let player=this.add.sprite(100,100,'dude',4);
     // this is the normal way to add object but we need movement in the object so instead of adding normal object we can use our physics  engine to create this sprite on the screen.
    // for adding physics we have to add the object in this way
    this.player=this.physics.add.sprite(100,100,'dude',4);
     //now when you check on the browser it started falling because of gravity .but its falling through the ground but instead of falling we want the object to land on the ground.for that what we can do is that when player and ground will collide and player will stop after collide with the ground. so now we have ground existing sprite and we have to add physics to it so this is how we can physics to it.
     this.physics.add.existing(ground);
 	// but actually we dont want to gravity to act on ground;for that we can do this.
     ground.body.allowGravity=false;
     ground.body.immovable=true;// but for making there is  many ways because all bodies re by default dynamic and for immovable we have to make it static and for this when we add physics then we have to pass one more parameter is true .
     //this.physics.add.existing(ground,true); and bydefault is false that mean is dynamic body of ground is created.
 	// after doing all these we can use inbuild collision detection mechanism and framework to detect collision between player and ground
     
     //lets add a collision detection between player and ground
     
     this.physics.add.collider(ground,this.player);
     // now both are falling when collision happen. for that we have to add immovable so that ground body can not move in any case.^
     
     
     // now we are going to add some apple and they are going to fall on the ground. 
     
     // so in this im not interested in adding on one apple but im interested to add group of apples .
     // there to way one is normal without physics but our apple object do have a velocity gravity for this wehave to add apples with physics.
     
     let fruits=this.physics.add.group({
         key: "apple", // key is that we have to specify that object is belong to which sprite 
         // now how many apples you want
         repeat:8,
         //now we have to reduce the size of apples for that we have to use the property called setScale
         setScale:{x:0.2,y:0.2}, //  what will this do is it reduces the size of each apple object by 80% means apple will become 20% of its actual size;
         // now we are goind to specity coordinates of each apple for this there is a property setXY
         setXY: {x:10,y:0,stepX:100}, // x,y is the first apple coordinate and stepx if that next coordinate should be place with the distance of 100 pixel from the last apple.  means starting from 10,0 and next apple will be at 110,0 and so on.
         
         
         
     });
     // now what we have to do is we have to add collision property of ground and apple
     this.physics.add.collider(fruits,ground);
     // now we have to add bouncing effect for this we have to make player from this to let so that we can use this variable in other function also. got to line no. 73 and let chnged into this. 
     
     // once we have created a player and player has a physical body then we can set bounce values
     this.player.setBounce(0.5);
     // if we setBounce is 1 then is keep on bouncing  and no energy loss but if the bounce set is less than one then its like a real collision and energy loss in every bounce.
     
     
     // now we are goind the apple animation more cool we are going to add bouncing effect to the all the apple
     
     // like we have a container and it contain all apples  and we have to iterate over all the apple and add bouncing effect and value is rand so that each apple gives a random bounce.
     
     
     fruits.children.iterate(function(f){//in iteration we have to call a function for each element 
         f.setBounce(Phaser.Math.FloatBetween(0.4,0.8));// this is the random function
     })
     
     
     //now we are going to create more platform ,we are going to create group but not normal group but static group that means the group of physical objects that they do not move. for this im going to staticGroup function
     
     let platforms=this.physics.add.staticGroup();
     platforms.create(500,350,'ground').setScale(2,0.5).refreshBody();
     
     platforms.create(700,200,'ground').setScale(2,0.5).refreshBody();
     platforms.create(100,200,'ground').setScale(2,0.5).refreshBody();
     //setScale(W,H) W is double and Height is half;
     // now we have to change the scale of the platform and for this we are going to use setScale function.
     
     //but using setScale function we can change height and width but can not change the actual shape of the body and its create problem when collision occur between apple and ground and it get only collide between ground actual image and apple so that for changing the actual shape accoring to new H and W we have to call function refreshBody() ^;
     
     
     //now we want that fruit also collide with plaforms 
     this.physics.add.collider(platforms,fruits);
     
     //now what we can do is our ground is actually have same functionalities as platforms but it have separate code so what we can do is make ground as a platform to simplify our code
     platforms.add(ground);
    // and now we have comment it out the code in line 84 and 85
     
//now we are going to focus on player animation and player movements
     //so lets focus on movements 
    //keyboard controls of the player 
     this.cursors=this.input.keyboard.createCursorKeys();//its an standard function in the phaser for any input keys from keyboard and in update function we will see any key pressed or not.
     
      
     
     
    this.physics.add.collider(platforms,this.player); 
     
     //now we are going to make animations for player
     this.anims.create(
     {
         //each animation will be an json object
         key:'left',
         frames: this.anims.generateFrameNumbers('dude',{start:0,end:3}),
         frameRate:10,//number of frames you need to play per second;
         repeat:-1,//it means repeat infinitly
         
     });
     
     
     //one for the left movement
     
     this.anims.create(
     {
         //each animation will be an json object
         key:'right',
         frames: this.anims.generateFrameNumbers('dude',{start:5,end:8}),
         frameRate:10,//number of frames you need to play per second;
         repeat:-1,//it means repeat infinitly
         
     });
     
     // one for the right movement
     
     
     
     this.anims.create(
     {
         //each animation will be an json object
         key:'center',
         frames: [{key: 'dude',frame:4}],
         frameRate:10,//number of frames you need to play per second;
         repeat:-1,//it means repeat infinitly
         
     });
     //one for the player facing center movmement
     
     //now we are going to add the effect of overlap when apple and player collide then apple become invisible
     
     this.physics.add.overlap(this.player,fruits,eatFruit,null,this);
     
     
     // dont allow player to move out of the game world
     this.player.setCollideWorldBounds(true);// WorldBound means entire game bound
     
     //now we are going to make camera effects and showing only the  player focusing on it instead of showing entire game world.
     
     //create cameras
     this.cameras.main.setBounds(0,0,W,H);
     this.physics.world.setBounds(0,0,W,H);
     
     this.cameras.main.startFollow(this.player,true,true);
     //this.cameras.main.setZoom(1.5);
     
     
 }

function eatFruit(player,fruit)
{
    fruit.disableBody(true,true);// this is the standard function to diable apple from the screen 
}
 function update()
 {
 	if(this.cursors.left.isDown)
        {
            this.player.setVelocityX(-player_config.player_speed); //setting velocity along x axis 
            this.player.anims.play('left',true);
        }
     else if(this.cursors.right.isDown)
         {
            this.player.setVelocityX(player_config.player_speed);
             this.player.anims.play('right',true);
         }
    else
        {
         this.player.setVelocityX(0);
        this.player.anims.play('center',true);
        }
     // lets now add jumping ability to our player
     
     if(this.cursors.up.isDown && this.player.body.touching.down)// and this if only work when playr is on ground else it kepp on jumping in air if you pressing up button
         {
             this.player.setVelocityY(player_config.player_jump_speed);
         }
     
     //now we have to add collisiong between platform and player 
     //for this go and check in line 163
     
     
     
     
     
     
     
 }
