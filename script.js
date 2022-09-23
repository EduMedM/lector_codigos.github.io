document.addEventListener("DOMContentLoaded", () => {
	const $resultados = document.querySelector("#resultado");
	Quagga.init({
		inputStream: {
			constraints: {
				width: 1080,
				height: 1080,
			},
			name: "Live",
			type: "LiveStream",
			target: document.querySelector('#contenedor'), // Pasar el elemento del DOM
		},
		decoder: {
			readers: ["ean_reader"]
		}
	}, function (err) {
		if (err) {
			console.log(err);
			return
		}
		console.log("Iniciado correctamente");
		Quagga.start();
	});

	Quagga.onDetected((data) => {
		$resultados.textContent = data.codeResult.code;
		// Imprimimos todo el data para que puedas depurar
		console.log(data);
        //console.log(data.codeResult.code);
		codeResultVar = data.codeResult.code.toString();
		console.log(codeResultVar);
		dataJSON(codeResultVar);
	});
});


Quagga.onProcessed(function (result) {
    var drawingCtx = Quagga.canvas.ctx.overlay,
      drawingCanvas = Quagga.canvas.dom.overlay;
  
    if (result) {
      if (result.boxes) {
        drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
        result.boxes.filter(function (box) {
          return box !== result.box;
        }).forEach(function (box) {
          Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
        });
      }
  
      if (result.box) {
        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
      }
  
      if (result.codeResult && result.codeResult.code) {
        Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
      }
    }
    
  });


//FUNCION PARA CONECTAR CON ARCHIVO JSON
function dataJSON(codeResultVar) {
    const requestURL = 'http://127.0.0.1:5500/data/database.json';
    //const requestURL = 'https://my-json-server.typicode.com/BySanDiaZz/bysandiazz-data.github.io/db';
    const request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();

    request.onload = function requestOnload() {
        productsRequest = request.response; //CONSTANTE PUBLICA (NO SE USA LET, VAR O CONST, SE DEJA SOLA POR LO QUE ES PUBLICA)
        insertInDOM(productsRequest,codeResultVar);
    }
}

cont = 0;
contAux = 0;

function insertInDOM(jsonObject,codeResultVar) {
    
	console.log("Resultado: "+ codeResultVar);


    products = jsonObject['products'];

    for(let i=0; i<products.length; i++){
		
		if(products[i].code == codeResultVar){

			let code = products[i].code;
			let name = products[i].name;
			let price = products[i].price;

			let element = document.getElementById("product"+cont+"");
			let aux = (element.classList.contains(''+code+''));
			

			if(aux==false){
				cont = cont + 1;
				contAux = cont;
				
				let print = "";
				print += 
					'<div id="product'+cont+'" class="'+code+' item-container">'+  
						'<div class="list-item">'+
							'<div class="product-img"><img class="item-img" src="./images/'+name+'.jpg"></img></div>'+
							'<div class="product-title"><p>'+name+'</p></div>'+
							'<div class="product-quantity"><img class="buttom-img" src="./images/bx-minus.svg" onClick="less('+cont+')"></img><img class="buttom-img" src="./images/bx-plus.svg" onClick="more('+cont+')"></img><h4 id="'+cont+'">1</h4></div>'+
							'<div class="product-price"><h4 class="price" id="price'+cont+'">'+price+'$</h4></div>'+
						'</div>'
					'</div>'

				const lista = document.querySelector('#products-container');
				lista.innerHTML += print;

				console.log(print);
				beep(); //Sonido de confirmacion de lectura
			}
		}
    }    
}

function codeInput(){
	let codeInput = document.querySelector(".code-input").value;
	console.log(codeInput);
	dataJSON(codeInput);

}

function backToHome(){
	window.open("start.html","_self");
}

function beep() {
    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
    snd.play();
}

function more(productN){
	let quantity = document.getElementById(""+productN+"").innerHTML;
	let quantityINT = parseInt(quantity);
	let quantityTotal = (quantityINT + 1);
	let quantityFinal = quantityTotal.toString();
	console.log(quantityFinal);
	document.getElementById(""+productN+"").innerHTML = quantityFinal;
	
	
	let price = document.getElementById("price"+productN+"").innerHTML;
	let priceFloat = parseFloat(price);
	let priceUD= (priceFloat / quantityINT);
	let priceTotal = (priceFloat + priceUD);
	let priceFinal = (priceTotal.toFixed(2)).toString();
	console.log(priceFinal);
	document.getElementById("price"+productN+"").innerHTML = ""+priceFinal+"$";
}

function less(productN){
	let quantity = document.getElementById(""+productN+"").innerHTML;
	let quantityINT = parseInt(quantity);
	let quantityTotal = (quantityINT - 1);
	let quantityFinal = quantityTotal.toString();
	console.log(quantityFinal);
	document.getElementById(""+productN+"").innerHTML = quantityFinal;
	
	
	let price = document.getElementById("price"+productN+"").innerHTML;
	let priceFloat = parseFloat(price);
	let priceUD= (priceFloat / quantityINT);
	let priceTotal = (priceFloat - priceUD);
	let priceFinal = (priceTotal.toFixed(2)).toString();
	console.log(priceFinal);
	document.getElementById("price"+productN+"").innerHTML = ""+priceFinal+"$";

	if(quantityFinal == "0"){
		let product = document.querySelector("#product"+productN+"");
		console.log(product);
		product.innerHTML = "";
	}
}

function buy(){
	let priceBuy = document.querySelectorAll(".price");
	let totalPrice = 0;
	
	priceBuy.forEach(element => {
		totalPrice += parseFloat(element.innerHTML);
		console.log(element);
		console.log(totalPrice);
	});
	console.log(totalPrice);

	openCart(totalPrice);
}

function openCart(totalPrice){
    const cart_container = document.querySelector(".total-containerBig");
    cart_container.classList.add("show-total-containerBig");
	let total_price = document.querySelector(".total-price");
	total_price.innerHTML = '<h1 class="total-price">'+totalPrice+'$</h1>'

}

function closeCart(){
    const cart_container = document.querySelector(".total-containerBig");
    cart_container.classList.remove("show-total-containerBig");
}

