import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import FileSaver from 'file-saver';
import enZip from './utils/zipTool'

const zip = new JSZip();

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      img: '',
      // 生成的压缩包文件路径
      fold: [
        {'/0_1/mmt.png': 'http://mybbstest.oss-cn-shenzhen.aliyuncs.com/head_1.png'},
        {'/0_1/mtt.png': 'http://mybbstest.oss-cn-shenzhen.aliyuncs.com/head_1.png'},
        {'/0_2/mmt.png': 'http://mybbstest.oss-cn-shenzhen.aliyuncs.com/head_1.png'},
        {'/0_2/mtt.png': 'http://mybbstest.oss-cn-shenzhen.aliyuncs.com/head_1.png'},
        {'/0_3/mmt.png': 'http://mybbstest.oss-cn-shenzhen.aliyuncs.com/head_1.png'},
        {'/0_3/mtt.png': 'http://mybbstest.oss-cn-shenzhen.aliyuncs.com/head_1.png'}
      ],
      // 解压出来的文件
      imgList: []
    }
  }

  componentDidMount() {
    this.getZip()
  }

  getZip = async () => {
    //  解压,仅支持
    await new JSZip.external.Promise(function (resolve, reject) {
      JSZipUtils.getBinaryContent('http://testupload1.oss-cn-shenzhen.aliyuncs.com/operate/1505990670.zip', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    }).then(JSZip.loadAsync)
      .then(async (zip) => {
        /**
         * 排除mos下的特殊情况，仅解压png,jpg
         */
        const zipFileList = await zip.file(/^[^(__MACOSX)][.\s\S]+(\.jpg)$|^[^(__MACOSX)][.\s\S]+(\.png)$/i); // type: arraybuffer
        //console.log(zipFileList)
        let arr = [];
        for (let obj of zipFileList) {
          let type = '';
          const name = obj.name.match(/(\/.[\s\S])+(.png)$|(\/.[\s\S])+(\.jpg)$/i);
          console.log(name);
          let pngRxg = new RegExp('(.png)$', 'i');
          if (pngRxg.test(obj.name)) {
            type = 'png'
          } else {
            type = 'jpeg'
          }
          const base64 = 'data:image/' + type + ';base64,' + btoa(
              new Uint8Array(await obj.async('arraybuffer'))
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
          arr.push({name, base64})
        }
        this.setState({imgList: arr});
      }).catch((err) => {
        console.log(err)
      })
  };

  onZip() {
    // 压缩网络图片
    enZip(this.state.fold)
  }

  render() {
    return (
      <div className="App">
        <div>
          <button type="button" onClick={this.onZip.bind(this)}>点啊沙冰，生成压缩包啊</button>
        </div>
        <div>下面就是解压出来的图片</div>
        <ul>
          {
            this.state.imgList.map((item, i) =>(
              <li key={i}><img src={item.base64}  style={{width: '100px'}}/></li>
            ))
          }
        </ul>
      </div>
    );
  }
}

export default App;
