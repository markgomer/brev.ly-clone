-- Model = application state
--
-- main -> init
-- init -> start model ; send msg to browser
-- view -> build html ; get user actions
-- update -> get user msg -> update model
-- subscription -> get msg from ether -> update model
-- model changed -> view called


module Main exposing (main)

import Browser
import Html exposing (Html, br, button, div, input, label, text)
import Html.Attributes exposing (placeholder)
import Html.Events exposing (onInput)


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias Model =
    { links : List Link
    , originalUrlInput : String
    , shortenedUrlInput : String
    }


type alias Link =
    { originalUrl : String
    , shortenedUrl : String
    , numberOfAccesses : Int
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( Model [] "" "", Cmd.none )



-- UPDATE


type Msg
    = GetLinks
    | OriginalUrlInput String
    | ShortenedUrlInput String
    | CreateLink


handleOriginalUrlInput : String -> Model -> ( Model, Cmd Msg )
handleOriginalUrlInput input model =
    ( { model | originalUrlInput = "https://" ++ input }, Cmd.none )


handleShortenedUrlInput : String -> Model -> ( Model, Cmd Msg )
handleShortenedUrlInput input model =
    ( { model | shortenedUrlInput = input }, Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GetLinks ->
            ( model, Cmd.none )

        OriginalUrlInput input ->
            handleOriginalUrlInput input model

        ShortenedUrlInput input ->
            handleShortenedUrlInput input model

        CreateLink ->
            ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Html Msg
view model =
    let
        renderModel =
            div []
                [ text ("OL = " ++ model.originalUrlInput)
                , br [] []
                , text ("SL = " ++ model.shortenedUrlInput)
                ]
    in
    div []
        [ div []
            [ text "Original Link" ]
        , div []
            [ input [ placeholder "https://", onInput OriginalUrlInput ] [] ]
        , div []
            [ text "Your Shortened Link" ]
        , div []
            [ input [ placeholder "brev.ly/", onInput ShortenedUrlInput ] [] ]
        , button [] [ text "Create" ]
        , renderModel
        ]
