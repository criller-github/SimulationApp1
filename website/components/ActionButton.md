# ActionButton

## Props

<!-- @vuese:ActionButton:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|icon|Modtager ikonnavnet fra parent (home.vue)|`String`|`false`|-|
|label|Modtager label fra parent (home.vue)|`String`|`false`|-|
|foodSelected|Modtager om mad er valgt fra parent (home.vue)|`Boolean`|`false`|-|

<!-- @vuese:ActionButton:props:end -->


## Events

<!-- @vuese:ActionButton:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|interaction-start|Udsend event når interaktionen starter (når brugeren klikker/toucher på knappen)|-|
|interaction-end|Udsend event når interaktionen slutter|-|
|action-interaction|Udsend en event hver gang drag-billedet er over katten|-|
|action-performed|-|-|

<!-- @vuese:ActionButton:events:end -->


## Methods

<!-- @vuese:ActionButton:methods:start -->
|Method|Description|Parameters|
|---|---|---|
|onPointerDown|Metode til at håndtere event listeners for bevægelse og frigivelse af klik/touch på vinduet afhængigt af inputtype og udsende en event (interaction-start) når interaktionen starter|-|
|onPointerMove|Håndterer positionen af drag-billedet og interaktionen med katten|-|
|onPointerUp|Håndterer musefrigivelse/touchfrigivelse og fjerne event listeners (interaction-end), drag-billedet og tjekker for droppet over katten og udsender en event når interaktionen slutter|-|
|createDragImage|Opretter et billede, der repræsenterer det trukkede element og indstiller dets position|-|
|moveDragImage|Flytter drag-billedet til den nye position og centrerer det over musen/touchet|-|
|removeDragImage|Fjerner drag-billedet fra DOM og nulstiller det|-|
|checkInteraction|Tjekker for interaktion med katten og udsender en event (action-interaction), hvis drag-billedet er over katten|-|
|checkDrop|Tjekker om droppet skete over katten og udsender en event (action-performed), hvis det gjorde|-|
|getDragImageSrc|Returnerer stien til drag-billedet baseret på hvilken handling, der er valgt (ikon)|-|

<!-- @vuese:ActionButton:methods:end -->


