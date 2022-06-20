  console.log(
    '%cMatrix Font Editor \n%cFor converting 8-bit variable-width characters to JSON',
    'font-family:"Montserrat",sans-serif;font-weight:600;font-size:20px;color:#f58220;',
    'font-family:"Montserrat",sans-serif;font-weight:600;font-size:20px;color:#000;'
  );

//  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
//  Helper Functions
//  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀

  function hasClass( el, className ) {
    return el.classList ? el.classList.contains( className ) : new RegExp( '\\b'+ className+'\\b' ).test( el.className );
  }

  function addClass( el, className ) {
    if ( el.classList ) el.classList.add( className );
    else if ( !hasClass( el, className ) ) el.className += ' ' + className;
  }

  function removeClass( el, className ) {
    if ( el.classList ) el.classList.remove( className );
    else el.className = el.className.replace( new RegExp( '\\b'+ className+'\\b', 'g' ), '' );
  }

  function toggleClass( el, className ) {
    if ( hasClass( el, className ) ) {
      removeClass( el, className );
    } else {
      addClass( el, className );
    }
  }

  function bin2hex( str ) {
    return '0x' + parseInt( str, 2 ).toString( 16 ).toUpperCase().padStart( 2, '0' );
  }

  function hex2bin( str ) {
    return ( "00000000" + ( parseInt( str ) ).toString( 2 ) ).substr( -8 );
  }

  function dec2hex( str ) {
      // return ( str / 256 + 1 / 512 ).toString( 16 ).substring( 2, 4 );
      return ( str ).toString( 16 ).padStart( 4, '0' );
  }

  function clearCanvas( canvas ) {
    canvas.getContext( '2d' ).fillStyle = "#FFFFFF";
    canvas.getContext( '2d' ).fillRect( 0, 0, canvas.width, canvas.height );
  }

  function paddedId( value ) {
    const padding = "000000000000000";

    value = value.replace( /glyph\-(\d+)/g, function( $0, integer ) {
      return padding.slice( integer.length ) + integer;
    } );
    return( value );
  }

//  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
//  Constants and variables
//  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀

  const canvasElement = document.getElementById( 'canvas' );
  const saveLocalButton = document.getElementById( 'save-local' );
  const addGlyphButton = document.getElementById( 'add-glyph' );
  const copyFontButton = document.getElementById( 'copy-font' );
  const saveFileButton = document.getElementById( 'save-file' );
  const loadFileButton = document.getElementById( 'load-file' );
  const fileUploadEl = document.getElementById( 'file-upload' );
  const testInput = document.getElementById( 'test-input' );
  const testCanvas = document.getElementById( 'test-canvas' );
  const editorCanvasElement = document.getElementById( 'editor-canvas' );
  const glyphDataOutput = document.getElementById( 'glyph-data' );
  const glyphsContainer = document.getElementById( 'glyphs' );
  const missingGlyph = [ '0xFF', '0x81', '0x81', '0x81', '0xFF' ];
  const unicodeWhitespaces = [ 9, 10, 11, 12, 13, 32, 133, 160, 5760, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199, 8200, 8201, 8202, 8232, 8233, 8239, 8287, 12288 ];

//  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
//  Canvas 2
//  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀

  editorCanvasElement.width = 32;
  editorCanvasElement.height = 8;

  function togglePixel( canvas, event ) {
      let context = canvas.getContext( '2d' );
      let rect = canvas.getBoundingClientRect();
      let scale = rect.width / canvas.offsetWidth;
      let x = Math.trunc( ( event.clientX - rect.left ) / scale );
      let y = Math.trunc( ( event.clientY - rect.top ) / scale );

      let pixelData = context.getImageData( x, y, 1, 1 ).data;
      if ( pixelData[ 0 ] === 0 && pixelData[ 1 ] === 0 && pixelData[ 2 ] === 0 ) { // black pixel
        context.fillStyle = "#FFFFFF";
      } else { // white pixel
        context.fillStyle = "#000000";
      }
      context.fillRect( x, y, 1, 1 );
      parseGlyph( canvas );
  }

  // output one glyph's data as an array of hex values
  function parseGlyph( canvas ) {
    let glyphData = [];

    for ( let pixelX = 0; pixelX < canvas.width; pixelX++ ) { // image columns
    let imageColumnBin = '';
    let imageColumnHex = '';
      for ( let pixelY = canvas.height - 1; pixelY >= 0; pixelY-- ) { // image rows
        let pixelData = canvas.getContext( '2d' ).getImageData( pixelX, pixelY, 1, 1 ).data;
          if ( pixelData[ 0 ] === 255 && pixelData[ 1 ] === 255 && pixelData[ 2 ] === 255 ) { // white pixel
            imageColumnBin += '0';
          } else if ( pixelData[ 0 ] === 0 && pixelData[ 1 ] === 0 && pixelData[ 2 ] === 0 ) { // black pixel
            imageColumnBin += '1';
          } else {
            alert( 'One or more images not bitmap!' );
            return;
          }
      }
      imageColumnHex = bin2hex( imageColumnBin );
      glyphData.push( imageColumnHex );
    }
    for ( let i = glyphData.length - 1; i >= 0; i-- ) {
      if ( glyphData[ i ] == '0x00' ) {
        glyphData.splice( i, 1 );
      } else {
        break;
      }
    }
    glyphDataOutput.value = JSON.stringify( glyphData );
    return glyphData;
  }

  editorCanvasElement.addEventListener( 'mousedown', function( e ) {
    togglePixel( editorCanvasElement, e );
  });

//  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
//  Creating images from JSON
//  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀

  function createSingleGlyph( position, fontData ) {
    let entry = document.createElement( 'li' );
    let renderedContainer = document.createElement( 'div' );
    let rendered = document.createElement( 'canvas' );
    let deleteButton = document.createElement( 'button' );
    let glyphData = [ '0x00' ];

    if ( fontData ) {
      glyphData = fontData[ position ];
    }

    addClass( renderedContainer, 'glyph-container' );

    renderedContainer.style.width = glyphData.length * 5 + 'px';
    renderedContainer.style.height = 8 * 5 + 'px';

    rendered.width = glyphData.length;
    rendered.height = 8;

    clearCanvas( rendered );
    drawGlyph( rendered, glyphData );

    addClass( deleteButton, 'delete-button' );
    deleteButton.setAttribute( 'onclick', 'deleteGlyph(this);return false;' );

    entry.id = 'glyph-' + position;
    addClass( entry, 'single-glyph' );
    entry.innerHTML += '<strong>&#' + position + '</strong><br>';
    entry.innerHTML += position + '<br>';
    entry.innerHTML += `&amp#${position}` + '<br>';
    entry.innerHTML += 'U+' + dec2hex( position );
    entry.setAttribute( 'onclick', 'activateGlyph(this);return false;' );

    glyphsContainer.appendChild( entry );
    entry.appendChild( renderedContainer );
    entry.appendChild( deleteButton );
    renderedContainer.appendChild( rendered );
  }

  function createExistingGlyphs( fontData ) {
    for ( const position in fontData ) {
      createSingleGlyph( position, fontData );
    }
  }


  function drawGlyph( canvas, glyphData, offset = 0 ) {
    let canvasContext = canvas.getContext( '2d' );

    for ( let pixelX = 0; pixelX < glyphData.length; pixelX++ ) { // image columns
      let column = '';
      if( glyphData[ pixelX ].startsWith( '0b' ) ) {
        // binary notation
        column = glyphData[ pixelX ].substring( 2 );
      } else if( glyphData[ pixelX ].startsWith( '0x' ) ) {
        // hexadecimal notation
        column = hex2bin( glyphData[ pixelX ] );
      } else {
        // decimal notation
        column = hex2bin( dec2hex( glyphData[ pixelX ] ) );
      }
      for ( let pixelY = 0; pixelY < canvas.height; pixelY++ ) { // image rows
        if ( column.substr( pixelY, 1 ) == '1' ) { // black pixel
          canvasContext.fillStyle = '#000000';
          canvasContext.fillRect( pixelX + offset, Math.abs( pixelY - 7 ), 1, 1 );
        }
      }
    }
  }

  function activateGlyph( el ) {
    let sourceCanvas = el.querySelector( 'canvas' );
    let position = el.id.replace(/[^0-9]/g,'');

    for ( let i = 0; i < glyphsContainer.children.length; i++ ) {
      removeClass( glyphsContainer.children[ i ], 'active' );
    }
    addClass( el, 'active' );
    editorCanvasElement.dataset.position = position;
    clearCanvas( editorCanvasElement );
    editorCanvasElement.getContext( '2d' ).drawImage( sourceCanvas, 0, 0 );
    parseGlyph( editorCanvasElement );
  }

  function deleteGlyph( el ) {
    el.parentElement.remove();
    event.stopPropagation();
  }

  function saveFont() {
    let glyphs = glyphsContainer.children;
    let outputFont = {};

    // clear font from localStorage
    localStorage.removeItem( 'myFont' );
    saveActiveGlyph();

    for ( let i = 0; i < glyphs.length; i++ ) {
      let position = glyphs[ i ].id.replace(/[^0-9]/g,'')
      let glyphCanvas = glyphs[ i ].querySelector( 'canvas' );

      outputFont[ position ] = parseGlyph( glyphCanvas ); // raw object
    }

    localStorage.setItem( 'myFont', JSON.stringify( outputFont ) );
    renderTest();
  }

  function saveActiveGlyph() {

    if ( editorCanvasElement.dataset.position ) {
      let sourceCanvas = editorCanvasElement;
      let position = editorCanvasElement.dataset.position;
      let destinationCanvas = document.getElementById( 'glyph-' + position ).querySelector( 'canvas' );
      let destinationCanvasWidth = parseGlyph( sourceCanvas ).length;

      destinationCanvas.parentElement.style.width = destinationCanvasWidth * 5 + 'px';
      destinationCanvas.width = destinationCanvasWidth;

      clearCanvas( destinationCanvas );
      destinationCanvas.getContext( '2d' ).drawImage( sourceCanvas, 0, 0 );
    }
  }

  function sortGlyphs() {
    var className = document.getElementsByClassName( 'single-glyph' );
    var glyphs = [];

    console.log( 'Sorting glyphs.' );
    for ( var i = 0; i < className.length; ++i ) {
      glyphs.push( className[ i ] );
    }

    glyphs.sort( function( a, b ) {
      let aPaddedId = paddedId( a.id );
      let bPaddedId = paddedId( b.id );

      return( aPaddedId < bPaddedId ? -1 : 1 );
    });

    glyphs.forEach( function( el ) {
      glyphsContainer.appendChild( el );
    });
  }

  function init() {
    if ( localStorage.myFont ) {
      createExistingGlyphs( JSON.parse( localStorage.myFont ) );
      console.log( 'Loaded font from localStorage.' );
    } else {
      createExistingGlyphs( startingFont );
      localStorage.setItem( 'myFont', JSON.stringify( startingFont ) );
      console.log( 'Loaded default font.' );
    }
    renderTest();
  }

  init();

//  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
//  Buttons
//  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀

  saveLocalButton.addEventListener( 'mousedown', function() {
    saveFont();
    console.log( 'Font saved to localStorage.' );
  });

  copyFontButton.addEventListener( 'mousedown', function() {
    saveFont();
    const textToCopy = localStorage.myFont;

    if ( !navigator.clipboard ) {
      console.log( 'Clipboard API not available, using workaround.' );
      const el = document.createElement( 'textarea' );
      el.value = textToCopy;
      document.body.appendChild( el );
      el.select();
      document.execCommand( 'copy' );
      document.body.removeChild( el );
    } else {
      console.log( 'Clipboard API available.' );
      navigator.clipboard.writeText( textToCopy );
    }
    console.log( 'Copied font to clipboard.' );
  });

  addGlyphButton.addEventListener( 'mousedown', function() {
    let position = prompt( 'Please enter glyph position\n(decimal notation, no leading zeros)', '' );

    if ( position in JSON.parse( localStorage.myFont ) ) {
      console.log( 'Position exists, loading glyph into editor.' );
    } else {
      console.log( 'Position doesn\'t exist, adding glyph.' );
      createSingleGlyph( position );
      sortGlyphs();
      saveFont();
    }
    activateGlyph( document.getElementById( 'glyph-' + position ) );
  });

  saveFileButton.addEventListener( 'mousedown', function() {
    downloadJson();
  });

//  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
//  Local load & save
//  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀

  // download the current state
  function downloadJson() {
    let blob = new Blob( [ localStorage.myFont ], { type: 'text/plain' } );
    let anchor = document.createElement( 'a' );

    saveFont();
    anchor.download = 'myMatrixFont.json';
    anchor.href = window.URL.createObjectURL( blob );
    anchor.target = '_blank';
    anchor.style.display = 'none'; // just to be safe!
    document.body.appendChild( anchor );
    anchor.click();
    document.body.removeChild( anchor );
    console.log( 'Saved font to file.' );
  }

  // load the json file
  loadFileButton.onclick = function () {
    fileUploadEl.click();
  };

  fileUploadEl.onchange = function ( e ) {
    let file = e.target.files[ 0 ];
    let reader = new FileReader();

    reader.onload = function( event ) {
      glyphsContainer.innerHTML = '';
      createExistingGlyphs( JSON.parse( event.target.result ) ); // event.target.result - loaded JSON data
      localStorage.setItem( 'myFont', event.target.result );
      console.log( 'Loaded font from file.' );
      renderTest();
    };
    reader.readAsText( file );
    return false;
  };

//  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
//  Testing
//  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀

  testInput.addEventListener( 'input', renderTest );

  function renderTest() {
    let font = JSON.parse( localStorage.myFont );
    let glyphOffset = 0;

    clearCanvas( testCanvas );

    for ( let i = 0; i < testInput.value.length; i++ ) {
      let glyphData = font[ testInput.value.substr( i, 1 ).charCodeAt() ];

      if ( glyphData ) {
        drawGlyph( testCanvas, glyphData, glyphOffset );
        glyphOffset += glyphData.length + 1;
      } else if ( testInput.value.substr( i, 1 ).charCodeAt() == 32 ) {
        glyphOffset += 4;
      } else {
        drawGlyph( testCanvas, missingGlyph, glyphOffset );
        glyphOffset += missingGlyph.length + 1;
      }
    }
  }
