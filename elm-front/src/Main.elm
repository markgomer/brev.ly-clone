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
import Html.Attributes exposing (placeholder, value)
import Html.Events exposing (onInput, onSubmit)
import Http exposing (Error)
import Json.Decode as D
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
    , status : Status
    }


type alias Link =
    { originalUrl : String
    , shortenedUrl : String
    , numberOfAccesses : Int
    }


type Status
    = Success
    | Error String
    | Loading


type Msg
    = OriginalUrlInput String
    | ShortenedUrlInput String
    | GetLinks
    | LinkListGotten (Result Http.Error (List Link))
    | CreateLink
    | LinkCreatedResponse (Result Http.Error String)


linkEncoder : String -> String -> E.Value
linkEncoder originalUrl shortenedUrl =
    E.object
        [ ( "originalLink", E.string originalUrl )
        , ( "shortenedLink", E.string shortenedUrl )
        ]


linkListDecoder : D.Decoder (List Link)
linkListDecoder =
    D.list linkDecoder


linkDecoder : D.Decoder Link
linkDecoder =
    D.map3 Link
        (D.field "originalURL" D.string)
        (D.field "shortenedURL" D.string)
        (D.field "numberOfAccesses" D.int)


init : () -> ( Model, Cmd Msg )
init _ =
    handleGetLinks (Model [] "" "" Loading)



-- UPDATE


handleGetLinks : Model -> ( Model, Cmd Msg )
handleGetLinks model =
    ( { model | status = Loading }
    , Http.get
        { expect = Http.expectJson LinkListGotten linkListDecoder
        , url = "http://localhost:3333/shortlinks"
        }
    )


handleGottenLinks : Result Http.Error (List Link) -> Model -> ( Model, Cmd Msg )
handleGottenLinks result model =
    case result of
        Ok linkList ->
            ( { model | links = linkList, status = Success }, Cmd.none )

        Err errMsg ->
            ( { model | status = Error (httpErrorToString errMsg) }, Cmd.none )


httpErrorToString : Http.Error -> String
httpErrorToString errMsg =
    case errMsg of
        Http.BadUrl url ->
            "Bad URL: " ++ url

        Http.Timeout ->
            "Request timed out"

        Http.NetworkError ->
            "Network error"

        Http.BadStatus code ->
            "Server error: " ++ String.fromInt code

        Http.BadBody body ->
            "Bad body: " ++ body


handleOriginalUrlInput : String -> Model -> ( Model, Cmd Msg )
handleOriginalUrlInput input model =
    ( { model | originalUrlInput = input }, Cmd.none )


handleShortenedUrlInput : String -> Model -> ( Model, Cmd Msg )
handleShortenedUrlInput input model =
    ( { model | shortenedUrlInput = input }, Cmd.none )


handleCreateLink : String -> String -> Model -> ( Model, Cmd Msg )
handleCreateLink original short model =
    let
        fullOriginal =
            if String.startsWith "http://" original || String.startsWith "https://" original then
                original

            else
                "https://" ++ original
    in
    ( { model | status = Loading }
    , Http.post
        { body = Http.jsonBody (linkEncoder fullOriginal short)
        , expect = Http.expectString LinkCreatedResponse
        , url = "http://localhost:3333/shortlinks"
        }
    )


handleLinkCreatedResponse : Result Http.Error String -> Model -> ( Model, Cmd Msg )
handleLinkCreatedResponse result model =
    case result of
        Ok _ ->
            let
                ( newModel, cmd ) =
                    handleGetLinks model
            in
            ( { newModel | status = Success, originalUrlInput = "", shortenedUrlInput = "" }, cmd )

        Err errMsg ->
            ( { model | status = Error (httpErrorToString errMsg) }, Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GetLinks ->
            handleGetLinks model

        LinkListGotten result ->
            handleGottenLinks result model

        OriginalUrlInput input ->
            handleOriginalUrlInput input model

        ShortenedUrlInput input ->
            handleShortenedUrlInput input model

        CreateLink ->
            handleCreateLink model.originalUrlInput model.shortenedUrlInput model

        LinkCreatedResponse result ->
            handleLinkCreatedResponse result model


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


renderLinkCard : Link -> Html Msg
renderLinkCard link =
    div []
        [ text (link.shortenedUrl ++ " -> ")
        , text (link.originalUrl ++ " -> ")
        , text (String.fromInt link.numberOfAccesses ++ " acessos")
        ]


renderLinkList : Model -> Html Msg
renderLinkList model =
    div [] (List.map renderLinkCard model.links)


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

        renderStatus : Html Msg
        renderStatus =
            case model.status of
                Loading ->
                    div [] [ text "Loading" ]

                Success ->
                    div [] [ text "List Loaded" ]

                Error errorMsg ->
                    div [] [ text errorMsg ]
    in
    form [ onSubmit CreateLink ]
        [ div []
            [ text "Original Link" ]
        , div []
            [ input
                [ placeholder "https://"
                , onInput OriginalUrlInput
                , value model.originalUrlInput
                ]
                []
            ]
        , div []
            [ text "Your Shortened Link" ]
        , div []
            [ input
                [ placeholder "brev.ly/"
                , onInput ShortenedUrlInput
                , value model.shortenedUrlInput
                ]
                []
            ]
        , button [] [ text "Create" ]
        , renderStatus
        , renderLinkList model
        , dEBUGrenderModel
        ]
