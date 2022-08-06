// Copied from COMP6080 content
export const fileToDataUrl = (file) => {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const valid = validFileTypes.find(type => type === file.type);
  if (!valid) {
    throw Error('provided file is not a png, jpg or jpeg image.');
  }

  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}

// modified from https://stackoverflow.com/a/3177838/13102935
export const timeSince = (date) => {
  var timeDif = Math.floor((new Date() - date) / 1000); // in seconds

  if (timeDif >= 31536000) {
    return Math.floor(timeDif / 31536000) + " years ago";
  }
  if (timeDif > 2592000) {
    return Math.floor(timeDif / 2592000) + " months ago";
  }
  if (timeDif > 86400) {
    return Math.floor(timeDif / 86400) + " days ago";
  }
  if (timeDif > 3600) {
    return Math.floor(timeDif / 3600) + " hours ago";
  }
  if (timeDif > 60) {
    return Math.floor(timeDif / 60) + " minutes ago";
  }
  return Math.floor(timeDif) + " seconds ago";
}
