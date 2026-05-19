module LinkListView exposing (renderLinkList)

import Html exposing (Html, a, button, div, text)
import Html.Attributes exposing (class, href, rel, target)
import Html.Events exposing (onClick)

import Data exposing (Model, Link)

renderLinkCard : (String -> msg) -> Link -> Html msg
renderLinkCard onDelete link =
    div []
        [ a
            [ href ("http://localhost:3333/" ++ link.shortenedUrl)
            , target "_blank"
            , rel "noreferrer"
            , class "link"
            ]
            [ text link.shortenedUrl ]
        , text (" -> " ++ link.originalUrl ++ " -> ")
        , text (String.fromInt link.numberOfAccesses ++ " acessos")
        , button [ onClick (onDelete link.shortenedUrl) ]
            [ text "x" ]
        ]


renderLinkList : (String -> msg) -> Model -> Html msg
renderLinkList onDelete model =
    div [] (List.map (renderLinkCard onDelete) model.links)
