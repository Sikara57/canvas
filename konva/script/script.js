window.onload=function()
{
    // partie pour afficher les changements des coordonnées et de taille
    var myDivChange= document.getElementById('stat');
    function affichage(x,y,w,h,compteur)
    {
        var xAffichage=document.createElement('span');// id=" + '">X : ' + x + ' </span><span id="y'+compteur+'">Y : '+y+' </span><span id="w'+compteur+'">Width : ' + w + ' </span><span id="h'+compteur+'">Height : '+h+' </span><br>');
        xAffichage.setAttribute('id','x'+ compteur);
        xAffichage.innerHTML='X : '+ x + ' ';
        myDivChange.appendChild(xAffichage);

        var yAffichage=document.createElement('span');
        yAffichage.setAttribute('id','y'+compteur);
        yAffichage.innerHTML='Y : '+y+ ' ';
        myDivChange.appendChild(yAffichage);
        
        var wAffichage=document.createElement('span');
        wAffichage.setAttribute('id','w'+compteur);
        wAffichage.innerHTML='W : '+w+ ' ';
        myDivChange.appendChild(wAffichage);
        
        var hAffichage=document.createElement('span');
        hAffichage.setAttribute('id','h'+compteur);
        hAffichage.innerHTML='H : '+h+ ' ';
        myDivChange.appendChild(hAffichage);

        var br=document.createElement('br');
        myDivChange.appendChild(br);        
    }

    function change(x,y,w,h,compteur)
    {
        var myX=document.getElementById('x'+compteur);
        var myY=document.getElementById('y'+compteur);
        var myW=document.getElementById('w'+compteur);
        var myH=document.getElementById('h'+compteur);

        myX.innerHTML='X : ' + x + ' ';
        myY.innerHTML='Y : ' + y + ' ';
        myW.innerHTML='W : ' + w + ' ';
        myH.innerHTML='H : ' + h + ' ';
    }
    // fin de partie juste pour afficher

    var stageWidth=500;
    var stageHeight=500;

    var compteur=0;

    var tabForm=[];

    var myCanva=document.getElementById('canva');
    myCanva.addEventListener('mouseup',fitStageIntoParentContainer);
    var mySubmit = document.getElementById('sub');
    mySubmit.addEventListener('click',detectSubmit);

    var stage = new Konva.Stage({
        container:'container', // id of container 
        width:stageWidth,
        height:stageHeight
    });

    // function update forme
    function update(activeAnchor)
    {
        var group = activeAnchor.getParent();
        var topLeft = group.get('.topLeft')[0];
        var topRight = group.get('.topRight')[0];
        var bottomRight = group.get('.bottomRight')[0];
        var bottomLeft = group.get('.bottomLeft')[0];
        var image = group.get('Rect')[0];

        var anchorX = activeAnchor.getX();
        var anchorY = activeAnchor.getY();

        switch (activeAnchor.getName()) {
            case 'topLeft':
                topRight.setY(anchorY);
                bottomLeft.setX(anchorX);
                break;
            case 'topRight':
                topLeft.setY(anchorY);
                bottomRight.setX(anchorX);
                break;
            case 'bottomRight':
                bottomLeft.setY(anchorY);
                topRight.setX(anchorX);
                break;
            case 'bottomLeft':
                bottomRight.setY(anchorY);
                topLeft.setX(anchorX);
                break;
        }

        image.position(topLeft.position());


        var width=topRight.getX() - topLeft.getX();
        var height = bottomLeft.getY() - topLeft.getY();

        if(width && height)
        {
            image.width(width);
            image.height(height);
        }

    }

    // function add anchor for resize
    function addAnchor(group, x, y, name) {
        var stage = group.getStage();
        var layer = group.getLayer();
        var anchor = new Konva.Circle({
            x: x,
            y: y,
            stroke: '#666',
            fill: '#ddd',
            strokeWidth: 2,
            radius: 8,
            name: name,
            draggable: true,
            dragOnTop: false
        });
        anchor.on('dragmove', function() {
            update(this);
            layer.draw();
        });
        anchor.on('mousedown touchstart', function() {
            group.setDraggable(false);
            this.moveToTop();
        });
        anchor.on('dragend', function() {
            group.setDraggable(true);
            layer.draw();
        });
        // add hover styling
        anchor.on('mouseover', function() {
            var layer = this.getLayer();
            document.body.style.cursor = 'pointer';
            this.setStrokeWidth(4);
            layer.draw();
        });
        anchor.on('mouseout', function() {
            var layer = this.getLayer();
            document.body.style.cursor = 'default';
            this.setStrokeWidth(2);
            layer.draw();
        });
        group.add(anchor);
    }

    // update size of canvas in application of resizing window by user
    function fitStageIntoParentContainer()
    {
        var container = document.querySelector('#canva');
        // now we need to fit stage into parent
        var containerWidth = container.offsetWidth;
        var containerHeight = container.offsetHeight;
        // to do this we need to scale the stage
        stage.width(containerWidth-4);
        stage.height(containerHeight-4);
        stage.draw();
    }

    function initRect(x,y,w,h)
    {
        var rect=new Konva.Rect({
            width: w,
            height: h,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 4,
        });

        var rectGroup = new Konva.Group({
            x:x,
            y:y,
            draggable:true
        });

        var form={
            'numero':compteur,
            'group': rectGroup,
            'forme': rect
        };

        tabForm[compteur]=form;

        form['group'].on('dragmove',function(){
            var vertTabPosition=this.position();
            var vertTabTaille=form['forme'];
            var vert=this.position();
            change(vert['x'],vert['y'],vertTabTaille.getWidth(),vertTabTaille.getHeight(),form['numero']);
        });


        layer.add(rectGroup);
        rectGroup.add(rect);
        addAnchor(rectGroup,0,0,'topLeft');
        addAnchor(rectGroup,100,0,'topRight');
        addAnchor(rectGroup,100,50,'bottomRight');
        addAnchor(rectGroup,0,50,'bottomLeft');
    }

    function initTriangle(x,y,w,h)
    {
        var poly = new Konva.Line({
            points: [(w/2),0,w,h,w-w,h+h-h],
            fill: '#00D2FF',
            stroke: 'black',
            strokeWidth: 1,
            closed : true
          });
        
        var rectGroup = new Konva.Group({
            x:x,
            y:y,
            draggable:true
        });

        var form={
            'numero':compteur,
            'group': rectGroup,
            'forme': poly
        };

        tabForm[compteur]=form;

        form['group'].on('dragmove',function(){
            var vertTabPosition=this.position();
            var vertTabTaille=form['forme'];
            var vert=this.position();
            console.log(vert);
            // change(vert['x'],vert['y'],vertTabTaille.getWidth(),vertTabTaille.getHeight(),form['numero']);
        });

        layer.add(rectGroup);
        rectGroup.add(poly);
    }

    function initRond()
    {

    }

    function detectSubmit()
    {
        var myForme = document.getElementById('formCanvas').value;
        switch(myForme)
        {
            case 'rond':
            {

                break;
            }
            case 'triangle':
            {   
                initTriangle(50,50,50,50);
                compteur+=1;
                stage.add(layer);
                break;
            }
            case 'rect':
            {
                initRect(0,0,100,50);
                affichage(0,0,100,50,compteur);
                compteur+=1;
                stage.add(layer);
                break;
            }
        }

    }


    fitStageIntoParentContainer();

    // create layer
    var layer=new Konva.Layer();

    // add the layer to the stage
    stage.add(layer);

}