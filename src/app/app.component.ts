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

  init(): any {
    this.httpGetAsync("http://tan-plume-book.glitch.me/folders", (response: string) => {
      console.log(response);
      this.folders = JSON.parse(response);
      this.folders.forEach(folder => {
        this.httpGetAsync("http://tan-plume-book.glitch.me/images?folder=" + folder, (response: string) => {
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
    this.addSmashed(this.imagesList[this.folderSelected].images[this.imagesList[this.folderSelected].count].base64);
    this.smashCounter += 1;
    this.totalCounter += 1;
    this.imagesList[this.folderSelected].count += 1;
  }

  pass() {
    this.addPassed(this.imagesList[this.folderSelected].images[this.imagesList[this.folderSelected].count].base64);
    this.passCounter += 1;
    this.totalCounter += 1;
    this.imagesList[this.folderSelected].count += 1;
  }

  addSmashed(base64:string) {
    let imgContainer = document.getElementById("smashedImg");
    let elem = document.createElement("img");
    elem.addEventListener("click", function () {
      var modal = document.getElementById("ventanaModal");
      let modalImg: HTMLElement | null = document.getElementById("modalImg");
      if (modalImg) {
        modalImg.setAttribute('src', base64);
      }
      if (modal) {
        modal.style.display = "block";
      }
    });
    elem.setAttribute("src", base64);
    elem.setAttribute("class", "minImg");
    elem.setAttribute("href", base64);
    if (imgContainer) {
      imgContainer.appendChild(elem);
    }
  }

  addPassed(base64: string) {
    let imgContainer = document.getElementById("passedImg");
    let elem = document.createElement("img");
    elem.addEventListener("click", function () {
      var modal = document.getElementById("ventanaModal");
      let modalImg: HTMLElement | null = document.getElementById("modalImg");
      if (modalImg) {
        modalImg.setAttribute('src', base64);
      }
      if (modal) {
        modal.style.display = "block";
      }
    });
    elem.setAttribute("src", base64);
    elem.setAttribute("class", "minImg");
    elem.setAttribute("href", base64);
    if (imgContainer) {
      imgContainer.appendChild(elem);
    }
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
