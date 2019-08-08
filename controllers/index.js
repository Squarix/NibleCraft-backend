const eventToPromise = require('event-to-promise');
const PDFDocument 	 = require('pdfkit');
const IndexModel  	 = require('../models/index');
const path 			  	 = require('path');
const fs						 = require('fs');

class IndexController {
	async processUser(req, res) {
		let user = await IndexModel.findUser(req.query.firstName);

		if (user) {
			// Add default image if user dont have it
			if (!user.image)
				await this.addImage(user);

			let docPath = await this.generateDoc(user);
			let doc = await fs.promises.readFile(docPath);
			await this.deleteFiles([docPath]);

			user.pdf = doc;
			await user.save();

			res.json({ status: 200, message: 'Ok'});
		} else {
			res.json({ status: 404, message: 'User not found'});
		}
	}

	// Generates document according to user data ## using pdfkit lib
	async generateDoc(user) {
		let imagePath = path.join(__dirname, '..', 'public', 'images', 'buffer.png');
		let docPath = path.join(__dirname, '..', 'public', 'pdf', 'buffer.pdf');

		let doc = new PDFDocument;

		// Write image in order to insert it in document
		await fs.promises.writeFile(imagePath, user.image);

		let stream = fs.createWriteStream(docPath);

		doc.pipe(stream);
		doc.fontSize(32)
			 .text(user.firstName + user.lastName, 100, 100);

		// Inserting image
		doc.image(imagePath, {
			fit: [500, 500],
			align: 'center',
			valign: 'center'
		});

		doc.end();
		let promise = eventToPromise(stream, 'finish');
		await promise;

		// Deleting buffer image
		await this.deleteFiles([imagePath]);

		return docPath;
	}

	async deleteFiles(files) {
		files.map( file => {
			fs.unlinkSync(file);
		});
	};

	// Adding image to user
	async addImage(user) {
		user.image = await fs.promises.readFile(path.join(__dirname, '..', 'public', 'images', 'node.png'));
		await user.save();
	}
}

module.exports = new IndexController();