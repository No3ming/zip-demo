/**
 * Created by ldm on 9/23/17.
 */
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import FileSaver from 'file-saver';

let zip = new JSZip();
let len = 0;

export const readFile = async(name, url, cd) => {
  const dataBlob = await canvasToblod(url);
  zip.file(name, dataBlob);
  cd();
};
// 将网络图片导入canvas后再导出blob对象(二进制)，并且返回，注意图片跨域问题，问题点：单线程，慢
export const canvasToblod = (url) => {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img,0,0);
        canvas.toBlob((blob) => {resolve(blob)});
      };
      img.crossOrigin = 'anonymous';
      img.src = url;
    })
      .then((dataUrl) => {
        return dataUrl
      })
  };

export default (folds) => {
  len = folds.length;
  //this.onZip()
  for(let obj of folds) {
    readFile(Object.keys(obj)[0], Object.values(obj)[0], () => {
      len--;
      if (len === 0) {
        zip.generateAsync({type:"blob"}).then(function(content) {
          // see FileSaver.js
          FileSaver.saveAs(content, "example.zip");
        });
      }
    })
  }
}

