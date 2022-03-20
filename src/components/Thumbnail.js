import PdfThumbnail from 'react-native-pdf-thumbnail';
const getThumbnail = async url => {
  const {uri, width, height} = await PdfThumbnail.generate(url, 0);
  return uri;
};

export default getThumbnail;
