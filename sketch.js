var dogImage;
var dogImage2;
var dog;
var database;
var food,foodStock,nameref,foodS;
var feed,addfood;
var fedTime,lastFed;
var input,button,greeting,Name;
var bedroomImg, gardenImg, washroomImg;
var sadDog;
var gameState = "Sleeping";

function preload(){
  DogImage = loadImage("images/dogImg.png");
  DogImage2 = loadImage("images/dogImg1.png");

  bedroomImg = loadImage("images/Bed Room.png");
  gardenImg = loadImage("images/Garden.png");
  washroomImg = loadImage("images/Wash Room.png");

  sadDog = loadImage("images/Lazy.png");
}

function setup() {
  createCanvas(500, 500);
   
  Dog = createSprite(400,250,50,50);
  Dog.addImage(DogImage);
  Dog.scale = 0.3;

  food = new Food()

  database = firebase.database();

  foodStock = database.ref("Food");
  foodStock.on("value",read,console.log("error"));

  nameref=database.ref("name");
  nameref.on("value",function(data){
  name=data.val();
  })

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  })
  
  
  feed=createButton("Feed the Dog");
  feed.position(580,67);
  feed.mousePressed(feeddog);

  addFood=createButton("Add Food")
  addFood.position(400,100);
  addFood.mousePressed(addFoods);

  input=createInput("Change Pet Name");
  input.position(400,67);
  
  button=createButton("SUBMIT");
  button.position(500,90);
  button.mousePressed(renamindog)
}

function draw() {  
  background("yellow");
  
  food.display()
   
  fedTime=database.ref("FeedTime");
  fedTime.on("value",function(data){
     lastFed=data.val();
   })
  
  fill("white");
  textSize(15);
  
 
  if(Name!==undefined){
  text("Your Pet Name: "+ name,55,100);
  }

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    //dog.remove();
  }else{
    feed.show();
    addFood.show();
    //dog.addImage(sadDog);
  }

  currentTime = hour();
  
  if(currentTime==(lastFed+1)){
    update("Playing");
    food.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    food.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    food.washroom();
  }else{
    update("Hungry");
    food.display();
  }

   drawSprites();
  }

function read(data){
  foodS= data.val();
  food.updateFoodStock(foodS);
}

function feeddog(){
  if(foodS>0){
  Dog.addImage(DogImage2);
  Dog.scale = 0.3
}

food.updateFoodStock(food.getFoodStock()-1);
database.ref("/").update({
  Food: food.getFoodStock(),
  FeedTime: hour()
  })
}

function addFoods(){
  foodS++;
  database.ref("/").update({
    Food:foodS
  })
}

function renamindog(){
  Name=input.value();
  button.hide();
  input.hide();
  database.ref("/").update({
  name:Name
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}