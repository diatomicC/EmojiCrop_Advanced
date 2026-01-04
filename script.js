const uploadBtn = document.getElementById("upload-btn");
const dropZone = document.getElementById("drop-zone");
const fileListContainer = document.getElementById("file-list-container");

// Store currently selected files
let currentFiles = [];

// File upload functionality
uploadBtn.addEventListener("click", () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.multiple = true;
  fileInput.onchange = () => {
    handleFileDrop(fileInput.files);
  };
  fileInput.click();
});

// Drag and drop functionality
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  handleFileDrop(e.dataTransfer.files);
});

// Display uploaded files
function displayFiles(files) {
  fileListContainer.innerHTML = "";
  if (files.length === 0) {
    return;
  }
  
  const title = document.createElement("div");
  title.textContent = `업로드된 파일 (${files.length}개)`;
  title.style.fontWeight = "bold";
  title.style.marginBottom = "0.5rem";
  fileListContainer.appendChild(title);
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileItem = document.createElement("div");
    fileItem.className = "file-item";
    
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.alt = file.name;
    
    const fileName = document.createElement("span");
    fileName.textContent = file.name;
    
    fileItem.appendChild(img);
    fileItem.appendChild(fileName);
    fileListContainer.appendChild(fileItem);
  }
}

// Handle file drop
function handleFileDrop(files) {
  currentFiles = Array.from(files);
  displayFiles(currentFiles);
}

// Process single file and return promise
function processFile(file, config) {
  return new Promise((resolve) => {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
      
      const sliceWidth = img.width / 4;
      const sliceHeight = img.height / 4;
      const slices = [];
      
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          const sliceCanvas = document.createElement("canvas");
          sliceCanvas.width = config.width;
          sliceCanvas.height = config.height;
          const sliceCtx = sliceCanvas.getContext("2d");
          
          if (config.addPadding) {
            // Add transparent padding
            sliceCtx.fillStyle = "rgba(0, 0, 0, 0)";
            sliceCtx.fillRect(0, 0, config.paddingLeft, config.height);
            sliceCtx.fillRect(config.width - config.paddingRight, 0, config.paddingRight, config.height);
            sliceCtx.drawImage(
              canvas,
              j * sliceWidth,
              i * sliceHeight,
              sliceWidth,
              sliceHeight,
              config.paddingLeft,
              0,
              config.drawWidth,
              config.drawHeight
            );
          } else {
            sliceCtx.drawImage(
              canvas,
              j * sliceWidth,
              i * sliceHeight,
              sliceWidth,
              sliceHeight,
              0,
              0,
              sliceCanvas.width,
              sliceCanvas.height
            );
          }
          slices.push(sliceCanvas.toDataURL("image/png"));
        }
      }
      
      // Add full canvas if needed
      if (config.addFullCanvas) {
        const fullCanvas = document.createElement("canvas");
        fullCanvas.width = config.width;
        fullCanvas.height = config.height;
        const fullCtx = fullCanvas.getContext("2d");
        if (config.addPadding) {
          fullCtx.fillStyle = "rgba(0, 0, 0, 0)";
          fullCtx.fillRect(0, 0, config.paddingLeft, config.height);
          fullCtx.fillRect(config.width - config.paddingRight, 0, config.paddingRight, config.height);
          fullCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, config.paddingLeft, 0, config.drawWidth, config.drawHeight);
        } else {
          fullCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, fullCanvas.width, fullCanvas.height);
        }
        slices.push(fullCanvas.toDataURL("image/png"));
      }
      
      resolve(slices);
    };
  });
}

// Process all files and create zip
async function processAllFiles(files, config, zipFileName) {
  const allSlices = [];
  
  // Process all files
  const promises = Array.from(files).map((file, fileIndex) => {
    return processFile(file, config).then((slices) => {
      // Add file index prefix to slice names
      return slices.map((slice, sliceIndex) => ({
        data: slice,
        name: `file${fileIndex + 1}_${sliceIndex + 1}.png`
      }));
    });
  });
  
  const results = await Promise.all(promises);
  
  // Flatten all slices
  results.forEach((fileSlices) => {
    allSlices.push(...fileSlices);
  });
  
  // Create zip file
  const zip = new JSZip();
  allSlices.forEach((slice) => {
    zip.file(slice.name, slice.data.split(",")[1], { base64: true });
  });
  
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, zipFileName);
}

// Button configurations
const buttonConfigs = {
  "kakao-btn": {
    width: 360,
    height: 360,
    addPadding: false,
    addFullCanvas: false,
    zipFileName: "kakaotalk_sticker.zip"
  },
  "naver-btn": {
    width: 740,
    height: 640,
    addPadding: true,
    paddingLeft: 50,
    paddingRight: 50,
    drawWidth: 640,
    drawHeight: 640,
    addFullCanvas: true,
    zipFileName: "OGQ_sticker.zip"
  },
  "line-btn": {
    width: 320,
    height: 270,
    addPadding: true,
    paddingLeft: 25,
    paddingRight: 25,
    drawWidth: 270,
    drawHeight: 270,
    addFullCanvas: true,
    zipFileName: "line_sticker.zip"
  },
  "band-btn": {
    width: 370,
    height: 320,
    addPadding: true,
    paddingLeft: 25,
    paddingRight: 25,
    drawWidth: 320,
    drawHeight: 320,
    addFullCanvas: true,
    zipFileName: "naver_band_sticker.zip"
  },
  "what-btn": {
    width: 512,
    height: 512,
    addPadding: false,
    addFullCanvas: false,
    zipFileName: "Whatsticker_sticker.zip"
  },
  "instatoon-btn": {
    width: 1000,
    height: 1000,
    addPadding: false,
    addFullCanvas: false,
    zipFileName: "instatoon_sticker.zip"
  }
};

// Register button click events (only once)
Object.keys(buttonConfigs).forEach((buttonId) => {
  document.querySelector(`#${buttonId}`).addEventListener("click", function () {
    if (currentFiles.length === 0) {
      alert("먼저 파일을 업로드해주세요.");
      return;
    }
    const config = buttonConfigs[buttonId];
    processAllFiles(currentFiles, config, config.zipFileName);
  });
});
