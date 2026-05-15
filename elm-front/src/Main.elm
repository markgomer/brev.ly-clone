module Main exposing (main)

import Browser
import Html exposing (Html, button, div, input, label, text)
import Html.Attributes exposing (for, type_)


main : Program () Model Msg
main =
    Browser.sandbox
        { init = init
        , view = view
        , update = update
        }


type alias Model =
    {}


init : Model
init =
    {}


type Msg
    = NoOp


update : Msg -> Model -> Model
update msg model =
    case msg of
        NoOp ->
            model


view : Model -> Html Msg
view model =
    div []
        [ div []
            [ label [ for "original" ] [ text "Original link: " ]
            , input [ type_ "text" ] []
            ]
        , div []
            [ label [ for "shortened" ] [ text "Shortened link: " ]
            , input [ type_ "text" ] []
            ]
        , button [] [ text "Send" ]
        ]
