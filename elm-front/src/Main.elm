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
import Html exposing (Html, br, button, div, form, input, text)
import Html.Attributes exposing (placeholder)
import Html.Events exposing (onInput, onSubmit)
import Http
import Json.Encode as E


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


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


linkEncoder : String -> String -> E.Value
linkEncoder originalUrl shortenedUrl =
    E.object
        [ ( "originalLink", E.string originalUrl )
        , ( "shortenedLink", E.string shortenedUrl )
        ]


init : () -> ( Model, Cmd Msg )
init _ =
    ( Model [] "" "", Cmd.none )



-- UPDATE


type Msg
    = GetLinks
    | OriginalUrlInput String
    | ShortenedUrlInput String
    | CreateLink
    | GotResponse (Result Http.Error String)


handleOriginalUrlInput : String -> Model -> ( Model, Cmd Msg )
handleOriginalUrlInput input model =
    ( { model | originalUrlInput = "https://" ++ input }, Cmd.none )


handleShortenedUrlInput : String -> Model -> ( Model, Cmd Msg )
handleShortenedUrlInput input model =
    ( { model | shortenedUrlInput = input }, Cmd.none )


handleCreateLink : String -> String -> Model -> (Model , Cmd Msg)
handleCreateLink original short model =
    ( model
    , Http.post
        { body = Http.jsonBody (linkEncoder original short)
        , expect = Http.expectString GotResponse
        , url = "http://localhost:3333/shortlinks"
        }
    )


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
            handleCreateLink model.originalUrlInput model.shortenedUrlInput model

        GotResponse result ->
            ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Model -> Html Msg
view model =
    let
        dEBUGrenderModel : Html Msg
        dEBUGrenderModel =
            div []
                [ text ("OL = " ++ model.originalUrlInput)
                , br [] []
                , text ("SL = " ++ model.shortenedUrlInput)
                ]
    in
    form [ onSubmit CreateLink ]
        [ div []
            [ text "Original Link" ]
        , div []
            [ input [ placeholder "https://", onInput OriginalUrlInput ] [] ]
        , div []
            [ text "Your Shortened Link" ]
        , div []
            [ input [ placeholder "brev.ly/", onInput ShortenedUrlInput ] [] ]
        , button [] [ text "Create" ]
        , dEBUGrenderModel
        ]
