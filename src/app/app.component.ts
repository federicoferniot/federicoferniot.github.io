import { Component, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'smashorpass';
  folders: string[] = [];
  folderSelected: string = "";
  imagesList: { [id: string]: ImgList } = {};
  count: number = 0;
  imagesLoaded: boolean = true;
  smashCounter: number = 0;
  passCounter: number = 0;
  totalCounter: number = 0;
  url: string = "https://tan-plume-book.glitch.me"

  init(): any {
    this.httpGetAsync( this.url + "/folders", (response: string) => {
      console.log(response);
      this.folders = JSON.parse(response);
      this.folders.forEach(folder => {
        this.httpGetAsync( this.url + "/images?folder=" + folder, (response: string) => {
          var responseJson: [] = JSON.parse(response);
          let responseImages: Img[] = [];
          responseJson.forEach(image => {
            responseImages.push(new Img(image['name'], image['content']));
          });
          let imglist: ImgList = new ImgList(responseImages);
          console.log(responseImages);
          this.imagesList[folder] = imglist;
        });
        this.imagesLoaded = true;
      })
    });
    window.addEventListener("click", function (event) {
      var modal = document.getElementById("ventanaModal");
      if (event.target == modal) {
        if(modal) modal.style.display = "none";
      }
    });
  }

  smash() {
    this.addSmashed(this.imagesList[this.folderSelected].images[this.imagesList[this.folderSelected].count]);
    this.smashCounter += 1;
    this.totalCounter += 1;
    this.imagesList[this.folderSelected].count += 1;
  }

  pass() {
    this.addPassed(this.imagesList[this.folderSelected].images[this.imagesList[this.folderSelected].count]);
    this.passCounter += 1;
    this.totalCounter += 1;
    this.imagesList[this.folderSelected].count += 1;
  }

  addSmashed(element: Img) {
    let imgContainer = document.getElementById("smashedImg");
    let elem = document.createElement("img");
    elem.addEventListener("click", function () {
      var modal = document.getElementById("ventanaModal");
      let modalImg: HTMLElement | null = document.getElementById("modalImg");
      let modalImgName: HTMLElement | null = document.getElementById("modalImgName");
      if (modalImg) {
        modalImg.setAttribute('src', element.base64);
      }
      if (modalImgName) {
        modalImgName.innerHTML = element.name.split('.')[0];
      }
      if (modal) {
        modal.style.display = "block";
      }
    });
    elem.setAttribute("src", element.base64);
    elem.setAttribute("class", "minImg");
    elem.setAttribute("href", element.base64);
    if (imgContainer) {
      imgContainer.appendChild(elem);
    }
  }

  clearCounter() {
    this.passCounter = 0;
    this.smashCounter = 0;
    this.count = 0;
    this.totalCounter = 0;
    Object.keys(this.imagesList).forEach(key => {
      this.imagesList[key].count = 0;
    })
    let divImgSmash = document.getElementById("smashedImg");
    let divImgPass = document.getElementById("passedImg");
    if (divImgSmash) divImgSmash.innerHTML = "";
    if (divImgPass) divImgPass.innerHTML = "";
  }

  addPassed(element: Img) {
    let imgContainer = document.getElementById("passedImg");
    let elem = document.createElement("img");
    elem.addEventListener("click", function () {
      var modal = document.getElementById("ventanaModal");
      let modalImg: HTMLElement | null = document.getElementById("modalImg");
      let modalImgName: HTMLElement | null = document.getElementById("modalImgName");
      if (modalImg) {
        modalImg.setAttribute('src', element.base64);
      }
      if (modalImgName) {
        modalImgName.innerHTML = element.name.split('.')[0];
      }
      if (modal) {
        modal.style.display = "block";
      }
    });
    elem.setAttribute("src", element.base64);
    elem.setAttribute("class", "minImg");
    elem.setAttribute("href", element.base64);
    if (imgContainer) {
      imgContainer.appendChild(elem);
    }
  }

  getName(name: string) {
    return name.split('.')[0];
  }


  httpGetAsync(theUrl: string, callback: Function){
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", theUrl, true);
  xmlHttp.send(null);
}

  constructor() {
    this.init();
  }
}

class ImgList {
  images: Img[];
  count: number = 0;
  constructor(images: Img[]) {
    this.images = images;
  }
}

class Img {
  name: string;
  base64: string;
  constructor(name: string, file: string) {
    this.name = name;
    this.base64 = file;
  }
}
