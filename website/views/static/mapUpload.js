document.getElementById("fileElem").addEventListener("Drop", DropFile);
document.getElementById("fileElem").addEventListener("change", handleFiles, false);
document.getElementById("fileElem").addEventListener("dragover", (e)=>{
	console.log("waitforit");
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
	console.log("hi");
	let files = document.getElementById('fileElem').files[0];
	let file = files[0];

	document.getElementById("fileElem").dataset.content = " file uploaded successfully";
	uploadMapModal.style.display = "block";
	modalBackgroundMap.style.display = "block";
}