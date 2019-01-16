from pyqart import QArtist, QrHalftonePrinter, QrImagePrinter, QrPainter

QR_VERSION = 10
POINT_PIXEL = 3

image = 'bitergia-owl-big.png'

artist = QArtist('https://jgbarah.github.io/testing/qr-ar-marker', image, QR_VERSION)
painter = QrPainter('https://jgbarah.github.io/testing/qr-ar-marker', QR_VERSION)
artist_data_only = QArtist('http://grimoirelab.github.io', image,
                           QR_VERSION, only_data=True)

# normal
QrImagePrinter.print(painter, path='/tmp/qr/normal.png', point_width=POINT_PIXEL)
# Halftone
QrHalftonePrinter.print(painter, path='/tmp/qr/halftone.png', img=image,
                        point_width=POINT_PIXEL, colorful=False)
# Halftone colorful
QrHalftonePrinter.print(painter, path='/tmp/qr/halftone-color.png', img=image,
                        point_width=POINT_PIXEL)
# Halftone pixel
QrHalftonePrinter.print(painter, path='/tmp/qr/halftone-pixel.png', img=image,
                        point_width=POINT_PIXEL, colorful=False,
                        pixelization=True)
# QArt
QrImagePrinter.print(artist, path='/tmp/qr/qart.png', point_width=POINT_PIXEL)
# QArt data only
QrImagePrinter.print(artist_data_only, path='/tmp/qr/qart-data-only.png',
                     point_width=POINT_PIXEL)
# HalfArt
QrHalftonePrinter.print(artist, path='/tmp/qr/halfart.png', point_width=POINT_PIXEL)
# HalfArt data only
QrHalftonePrinter.print(artist_data_only, path='/tmp/qr/halfart-data-only.png',
                        point_width=POINT_PIXEL)
