# CatComponent

Importerer CatTextDataService fra services-mappen

## Props

<!-- @vuese:CatComponent:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|status|Modtager kattens status fra the parent (Home.vue)|`Object`|`false`|-|
|catSize|Modtager kattens størrelse som prop fra forælderen|`Number`|`false`|Typen er et tal, fordi det er en størrelse|
|currentProblem|Modtager det aktuelle problem fra forælderen(home.vue)|`String`|`false`|Typen er en streng fordi det er en tekst (hunger, happiness, hygiene, injured)|

<!-- @vuese:CatComponent:props:end -->


## Events

<!-- @vuese:CatComponent:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|show-notification|Sætter catText til den tekst, der returneres af API'en|-|

<!-- @vuese:CatComponent:events:end -->


## Methods

<!-- @vuese:CatComponent:methods:start -->
|Method|Description|Parameters|
|---|---|---|
|playMeow|Håndterer når en handling droppes hen på katten|-|
|showNotification||-|

<!-- @vuese:CatComponent:methods:end -->


## Computed

<!-- @vuese:CatComponent:computed:start -->
|Computed|Type|Description|From Store|
|---|---|---|---|
|catImage|-||No|
|imageId|-||No|

<!-- @vuese:CatComponent:computed:end -->


## Watch

<!-- @vuese:CatComponent:watch:start -->
|Name|Description|Parameters|
|---|---|---|
|imageId||-|

<!-- @vuese:CatComponent:watch:end -->


