router.post("/upload", upload.single("file"), async (req, res, next) => {
  try {
    const response = await uploadCloud.useConvert({
      file: req.file,
      folder: UPCLOUD_FOLDERS.educationMaterials,
    });
    return res.status(200).send(response);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
});

router.post("/upload-2", upload.single("avatar"), async (req, res, next) => {
  try {
    const response = await uploadCloud.normal({
      file: req.file,
      folder: UPCLOUD_FOLDERS.avatars,
    });
    return res.status(200).send(response);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
});
