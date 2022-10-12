const jimp = require("jimp");

async function handleAvatar(avatarPath) {
  const image = await jimp.read(avatarPath);
  await image.cover(
    250,
    250,
    jimp.HORIZONTAL_ALIGN_LEFT | jimp.VERTICAL_ALIGN_TOP
  );
  await image.writeAsync(avatarPath);
}

module.exports = handleAvatar;
