module LinkListView exposing (renderLinkList)

import Data exposing (Link, Model)
import Html exposing (Html, a, button, div, text)
import Html.Attributes exposing (class, href, rel, target)
import Html.Events exposing (onClick)



-- Elm see output is Msg. Elm substitute a_msg (small) with Msg (capital).
-- Now the signatures match: (String -> Msg) -> Model -> Html Msg
renderLinkList : (String -> a_msg) -> Model -> Html a_msg
renderLinkList delStrToMsg model =
    div [] (List.map (renderLinkCard delStrToMsg) model.links)


renderLinkCard : (String -> a_msg) -> Link -> Html a_msg
renderLinkCard delStrToMsg link =
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
        , button [ onClick (delStrToMsg link.shortenedUrl) ]
            [ text "x" ]
        ]
