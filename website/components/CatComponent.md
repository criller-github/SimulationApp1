# CatComponent

Importerer CatTextDataService fra services-mappen

## Props

<!-- @vuese:CatComponent:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|status|-|`Object`|`false`|-|
|catSize|Modtager kattens status fra the parent (Home.vue)|Modtager kattens størrelse som prop fra forælderen|`false`|1|
|currentProblem|-|Modtager det aktuelle problem fra forælderen(home.vue)|`false`|Typen er en streng fordi det er en tekst (hunger, happiness, hygiene, injured)|

<!-- @vuese:CatComponent:props:end -->


## Events

<!-- @vuese:CatComponent:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|show-notification|Sætter catText til den tekst, der returneres af API'en|-|

<!-- @vuese:CatComponent:events:end -->


