const icon=L.icon({
    iconUrl: 'leaflet-1.7.1/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'leaflet-1.7.1/marker-shadow.png',
    shadowSize: [41, 41]
});

let map=L.map('mapka1').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker=L.marker([53.430127, 14.564802], { icon: icon }).addTo(map);
marker.bindPopup("<strong>twoja lokalizacja</strong><br>").openPopup();

if(Notification.permission!=="granted" && Notification.permission!=="denied") {
    Notification.requestPermission();
}

function getLocation(){
    if(!navigator.geolocation){
        alert("geolokalizacja niedostępna");
        return;
    }

    if(Notification.permission!=="granted" && Notification.permission!=="denied"){
        Notification.requestPermission();
    }

    navigator.geolocation.getCurrentPosition(
        (position)=>{
            let lat=position.coords.latitude;
            let lon=position.coords.longitude;
            map.setView([lat, lon], 18);
            marker.setLatLng([lat, lon]);
            marker.setPopupContent("<strong>twoja lokalizacja</strong><br>" +
                `szerokość: ${lat.toFixed(4)}<br>` +
                `długość: ${lon.toFixed(4)}`).openPopup();
        },
        (error)=>{
            const errorMessages={
                [error.PERMISSION_DENIED]: "brak zgody na lokalizację",
                [error.POSITION_UNAVAILABLE]: "lokalizacja niedostępna",
                [error.TIMEOUT]: "czas oczekiwania na lokalizację upłynął",
                [error.UNKNOWN_ERROR]: "nieznany błąd"
            };
            alert(errorMessages[error.code] || "nieznany błąd");
        },
        { enableHighAccuracy: true }
    );
}

document.getElementById("lokalizacja").addEventListener("click", getLocation);

document.getElementById("pobierz").addEventListener("click", handleMapDownload);

function handleMapDownload(){
    generateMapImage(map)
        .then(canvas=>{
            divideAndShuffleMap(canvas);
        })
        .catch(err=>{
            console.error("błąd generowania mapy:", err);
        });
}

function generateMapImage(map){
    return new Promise((resolve, reject)=>{
        leafletImage(map, function(err, canvas) {
            if (err){
                console.error("błąd:", err);
                return reject(err);
            }
            resolve(canvas);
        });
    });
}

const pieceSize=100;
const totalPieces=16;
let pieces=[];

function divideAndShuffleMap(canvas) {
    for(let y=0; y<4; y++){
        for(let x=0; x<4; x++){
            const pieceCanvas=document.createElement('canvas');
            pieceCanvas.width=pieceSize;
            pieceCanvas.height=pieceSize;
            const pieceContext=pieceCanvas.getContext('2d');
            pieceContext.drawImage(canvas, x*pieceSize, y*pieceSize, pieceSize, pieceSize, 0, 0, pieceSize, pieceSize);
            pieces.push({ canvas: pieceCanvas, originalPosition: { x, y }, currentPosition: { x: -1, y: -1 } });
        }
    }

    pieces.sort(()=>Math.random() - 0.5);

    const rozsypanieDiv=document.getElementById('rozsypanie');
    rozsypanieDiv.innerHTML='';

    pieces.forEach((piece, index)=>{
        const img=piece.canvas;
        img.classList.add('item');
        img.draggable=true;
        img.id=`piece-${index}`;

        img.addEventListener('dragstart', handleDragStart);
        img.addEventListener('dragend', handleDragEnd);

        img.style.position='absolute';
        img.style.left=`${Math.random()*(400-pieceSize)}px`;
        img.style.top=`${Math.random()*(400-pieceSize)}px`;

        rozsypanieDiv.appendChild(img);
    });
}

function handleDragStart(e){
    e.dataTransfer.setData('text/plain', e.target.id);
    e.target.style.opacity='0.5';
}

function handleDragEnd(e){
    e.target.style.opacity='';
}

const układDiv=document.getElementById('uklad');

układDiv.addEventListener('dragover', handleDragOver);
układDiv.addEventListener('drop', handleDrop);

function handleDragOver(e){
    e.preventDefault();
}

function handleDrop(e){
    e.preventDefault();
    const pieceId=e.dataTransfer.getData('text/plain');
    const piece=document.getElementById(pieceId);
    
    const index=parseInt(pieceId.split('-')[1]);
    const originalPosition=pieces[index].originalPosition;

    const correctLeft=originalPosition.x*pieceSize;
    const correctTop=originalPosition.y*pieceSize;

    const dropX=e.clientX-układDiv.getBoundingClientRect().left;
    const dropY=e.clientY-układDiv.getBoundingClientRect().top;

    if(
        dropX>=correctLeft &&
        dropX<correctLeft+pieceSize &&
        dropY>=correctTop &&
        dropY<correctTop+pieceSize
    ){
        piece.style.left=`${correctLeft}px`;
        piece.style.top=`${correctTop}px`;
        
        pieces[index].currentPosition={ x: originalPosition.x, y: originalPosition.y };
        układDiv.appendChild(piece);
        checkPuzzleCompletion();
    } else{
        piece.style.left=`${Math.random()*(400-pieceSize)}px`;
        piece.style.top=`${Math.random()*(400-pieceSize)}px`;
    }
}

function checkPuzzleCompletion(){
    const placedPieces=document.querySelectorAll('#uklad .item');
    let completed=true;

    placedPieces.forEach((piece, index)=>{
        const originalPosition=pieces[index].originalPosition;
        const correctLeft=originalPosition.x*pieceSize;
        const correctTop=originalPosition.y*pieceSize;

        if(
            parseInt(piece.style.left)!==correctLeft ||
            parseInt(piece.style.top)!==correctTop
        ){
            completed=false;
        }
    });

    if(completed && placedPieces.length===totalPieces){
        console.log("wszytskie puzzle ułozone");
        showCompletionNotification();
    }
}

function showCompletionNotification(){
    if (Notification.permission==="granted"){
        new Notification("puzzle ułożone");
    } else if(Notification.permission!=="denied"){
        Notification.requestPermission().then(permission=>{
            if(permission==="granted"){
                new Notification("puzzle ułożone");
            }
        });
    }
}

