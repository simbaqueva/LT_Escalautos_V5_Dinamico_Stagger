// Script para crear Lower Third V5 (ESTILO GEOMÉTRICO CON ENTRADAS ESCALONADAS)
// Animación dinámica elemento por elemento (Staggered Animation) como en producción premium.

(function createLowerThirdV5_DynamicStagger() {
    app.beginUndoGroup("Crear LT Escalautos V5 Dinamico");

    var compName = "LT_Escalautos_V5_Estilo_TV";
    var compW = 1920;
    var compH = 1080;
    var myComp = app.project.items.addComp(compName, compW, compH, 1.0, 10, 29.97);

    // --- IMPORTAR LOGO ---
    var logoPath = "C:/Users/janus/Downloads/comerciales city tv escalautos/COMERCIAL/logo escalautos.png";
    var logoFile = new File(logoPath);
    var logoItem = null;
    if (logoFile.exists) {
        logoItem = app.project.importFile(new ImportOptions(logoFile));
    } else {
        alert("Logo no encontrado. Importar manual.");
    }

    // --- COLORES CORPORATIVOS ---
    var cAzulOscuro = [0, 21/255, 52/255];      // Base textos
    var cMorado = [112/255, 27/255, 250/255];   // Cinta animada
    var cAzulClaro = [0, 153/255, 246/255];     // Redes Sociales
    var cVerde = [0, 230/255, 136/255];         // Títulos
    var cBlanco = [1, 1, 1];                    // Logo y Textos descriptivos

    var tiltAngle = -15;

    // --- HELPER PARA CAJAS INCLINADAS ---
    function createSkewedRect(name, size, position, fillColor, skewAngle) {
        var shape = myComp.layers.addShape();
        shape.name = name;
        var group = shape.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
        var rect = group.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Rect");
        rect.property("ADBE Vector Rect Size").setValue(size);
        rect.property("ADBE Vector Rect Roundness").setValue(5); 
        
        var transform = group.property("ADBE Vector Transform Group");
        transform.property("ADBE Vector Skew").setValue(skewAngle);
        
        var fill = group.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill");
        fill.property("ADBE Vector Fill Color").setValue(fillColor);
        shape.property("ADBE Transform Group").property("ADBE Position").setValue(position);
        
        var shadowFX = shape.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow");
        shadowFX.property(2).setValue(155); // Opacidad
        shadowFX.property(3).setValue(135); // Dirección
        shadowFX.property(4).setValue(15);  // Distancia
        shadowFX.property(5).setValue(20);  // Suavidad
        return shape;
    }

    // --- CAPAS GEOMÉTRICAS ---
    var ribbonAccent = createSkewedRect("Cinta de Acento (Morado)", [1350, 160], [1070, 915], cMorado, tiltAngle);
    var basePlate = createSkewedRect("Caja de Textos (AzulOscuro)", [1350, 160], [1040, 930], cAzulOscuro, tiltAngle);
    var logoBox = createSkewedRect("Caja del Logo (Blanco)", [400, 160], [280, 930], cBlanco, tiltAngle);

    // --- LOGO ESCALADO ---
    var logoLayer = null;
    if (logoItem) {
        logoLayer = myComp.layers.add(logoItem);
        var scaleW = (300 / logoItem.width) * 100;
        var scaleH = (120 / logoItem.height) * 100;
        var finalScale = Math.min(scaleW, scaleH);
        logoLayer.property("ADBE Transform Group").property("ADBE Scale").setValue([finalScale, finalScale]);
        logoLayer.property("ADBE Transform Group").property("ADBE Position").setValue([280, 930]);
    }

    // --- TEXTOS ---
    function createText(name, str, font, size, color, pos) {
        var t = myComp.layers.addText(str);
        t.name = name;
        var doc = t.property("ADBE Text Properties").property("ADBE Text Document").value;
        doc.font = font; 
        doc.fontSize = size;
        doc.fillColor = color;
        doc.justification = ParagraphJustification.LEFT_JUSTIFY;
        t.property("ADBE Text Properties").property("ADBE Text Document").setValue(doc);
        t.property("ADBE Transform Group").property("ADBE Position").setValue(pos);
        return t;
    }

    var txtD1 = createText("Texto: Título", "SEDES BOGOTÁ: C.C. Paseo Villa del Rio (Diag. 57C Sur Nº62-60)", "SegoeUI-Bold", 26, cVerde, [470, 882]);
    var txtD2 = createText("Texto: Dirección 2", "Y C.C. Outlet Factory (Av. Américas 62-84)", "SegoeUI-Bold", 26, cBlanco, [470, 924]);
    var txtW  = createText("Texto: Redes / Web", "Web: escalautos.com    |    Síguenos (FB/IG/TT): @escalautos.oficial", "SegoeUI-Bold", 32, cAzulClaro, [470, 982]);

    // --- MOTOR DE ANIMACIÓN ESCALONADA (STAGGER) ---
    // Funciones Helper para inyectar expresiones en cada capa

    function applySlideLeft(layer, delayTime) {
        var expr = 
        "var delay = " + delayTime + ";\n" +
        "var t = time - inPoint - delay;\n" +
        "if(t > 0 && t < 7) {\n" +
        "  var p0 = value + [-2200, 0];\n" +   
        "  var p1 = value;\n" +     
        "  var decay = 5.0;\n" +     
        "  var freq = 1.3;\n" +      
        "  var x = p1[0] + (p0[0]-p1[0])*Math.exp(-decay*t)*Math.cos(freq*t*2*Math.PI);\n" +
        "  [x, p1[1]];\n" +
        "} else if (t <= 0) {\n" +
        "  value + [-2200, 0];\n" +
        "} else {\n" +
        "  var tOut = time - 8 - inPoint;\n" +
        "  easeIn(tOut, 0, 0.4, value, value + [-2200,0]);\n" +
        "}";
        layer.property("ADBE Transform Group").property("ADBE Position").expression = expr;
    }

    function applyPopScale(layer, delayTime) {
        var expr = 
        "var delay = " + delayTime + ";\n" +
        "var t = time - inPoint - delay;\n" +
        "if(t > 0 && t < 7) {\n" +
        "  var p0 = [0, 0];\n" +   
        "  var p1 = value;\n" +     
        "  var decay = 6.0;\n" +     
        "  var freq = 2.0;\n" +      
        "  var sX = p1[0] + (p0[0]-p1[0])*Math.exp(-decay*t)*Math.cos(freq*t*2*Math.PI);\n" +
        "  var sY = p1[1] + (p0[1]-p1[1])*Math.exp(-decay*t)*Math.cos(freq*t*2*Math.PI);\n" +
        "  [sX, sY];\n" +
        "} else if (t <= 0) {\n" +
        "  [0, 0];\n" +
        "} else {\n" +
        "  var tOut = time - 8 - inPoint;\n" +
        "  easeIn(tOut, 0, 0.3, value, [0,0]);\n" +
        "}";
        layer.property("ADBE Transform Group").property("ADBE Scale").expression = expr;
    }

    function applyTextReveal(layer, delayTime) {
        var posExpr = 
        "var delay = " + delayTime + ";\n" +
        "var t = time - inPoint - delay;\n" +
        "if(t > 0 && t < 7) {\n" +
        "  easeOut(t, 0, 0.5, value + [0, 50], value);\n" +
        "} else if (t <= 0) {\n" +
        "  value + [0, 50];\n" +
        "} else {\n" +
        "  var tOut = time - 8 - inPoint;\n" +
        "  easeIn(tOut, 0, 0.3, value, value - [0, 50]);\n" + // Salen hacia arriba
        "}";
        layer.property("ADBE Transform Group").property("ADBE Position").expression = posExpr;

        var opExpr = 
        "var delay = " + delayTime + ";\n" +
        "var t = time - inPoint - delay;\n" +
        "if(t > 0 && t < 7) {\n" +
        "  ease(t, 0, 0.4, 0, 100);\n" +
        "} else if (t <= 0) {\n" +
        "  0;\n" +
        "} else {\n" +
        "  var tOut = time - 8 - inPoint;\n" +
        "  ease(tOut, 0, 0.3, 100, 0);\n" +
        "}";
        layer.property("ADBE Transform Group").property("ADBE Opacity").expression = opExpr;
    }

    // APLICAR RESTRASOS (DELAYS) FORMANDO UNA COREOGRAFÍA DINÁMICA
    applySlideLeft(ribbonAccent, 0.00); 
    applySlideLeft(basePlate,    0.15); 
    applyPopScale(logoBox,       0.30); // La caja del logo "Pops" (aparece inflandose) en 0.30s
    if(logoLayer) {
        applyPopScale(logoLayer, 0.45); // El logo verdadero aparece inflandose después de su caja en 0.45s
    }
    
    // Los Textos entran flotando suavemente desde abajo y apareciendo uno a uno
    applyTextReveal(txtD1, 0.55);
    applyTextReveal(txtD2, 0.65);
    applyTextReveal(txtW,  0.75);

    // Abrir composición en el visualizador
    myComp.openInViewer();
    app.endUndoGroup();
})();
