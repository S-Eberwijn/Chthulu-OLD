document.getElementById("closeButtonMap").addEventListener("click", closeButtonMap);
document.getElementById("fileElem").addEventListener("change", handleFiles, false);
document.getElementById("fileElem").addEventListener("dragover", (e)=>{
	e.preventDefault();
});

ondrop = (e) => {
	e.preventDefault();
	showModal(e)
};

function handleFiles(e) {
	showModal(e);
}

function showModal(e){
	e.preventDefault();

	let file = document.getElementById('fileElem').files[0];
	file.name = Date.now() + file.name.split(".")[file.name.split(".").length - 1];

	uploadMapImage(file);

	document.getElementById("fileElem").dataset.content = " file uploaded successfully";
	uploadMapModal.style.display = "block";
	modalBackgroundMap.style.display = "block";
}

function closeButtonMap(){
	console.log("test");
	resetPage();
}

function resetPage(){
	uploadMapModal.style.display = "none";
	modalBackgroundMap.style.display = "none";
	document.getElementById("fileElem").dataset.content = " Upload file";
}

function uploadMapImage(file){
    let reader = new FileReader();
    reader.onloadend = function() {
		setTimeout(() => {
			try {
				axios.post(`/dashboard/${guildID}/informational/mapImage`, {
					"file": reader.result,
					"fileName": file.name
				}).then(response => {
					if (response.status === 200) {
						console.log("request handled successfully", response);
					} else {
						console.log("Something went wrong!; ERROR STATUS: " + response.status);
					}
				}).catch((err) => {
					console.log(err)
					pushNotify('error', 'Quest creation', 'Something went wrong!')
	
				})
			} catch (error) {
				console.log(error);
				console.log("error occured during create");
			}
		}, 250);
    }
    reader.readAsDataURL(file);
	
}