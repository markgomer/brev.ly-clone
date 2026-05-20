-- Model = application state
--
-- main -> init
-- init -> start model ; send msg to browser
-- view -> build html ; get user actions
-- update -> get user msg -> update model
-- subscription -> get msg from ether -> update model
-- model changed -> view called


module Main exposing (Msg(..), OutgoingMsg(..), main)

import Browser
import Data exposing (Link, Model, Status(..), linkEncoder, linkListDecoder)
import Html exposing (Html, button, div, form, input, text)
import Html.Attributes exposing (placeholder, value)
import Html.Events exposing (onInput, onSubmit)
import Http exposing (Error)
import LinkListView


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


init : () -> ( Model, Cmd Msg )
init _ =
    handleGetLinks (Model [] "" "" Loading)



-- UPDATE


type IncomingMsg
    = LinkListGotten (Result Http.Error (List Link))
    | StringResponse (Result Http.Error String)


type OutgoingMsg
    = CreateLink
    | GetLinks
    | DeleteLink String


type InternalMsg
    = OriginalUrlInput String
    | ShortenedUrlInput String


type Msg
    = InternalMsg InternalMsg
    | OutgoingMsg OutgoingMsg
    | IncomingMsg IncomingMsg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        IncomingMsg incomingMsg ->
            handleIncomingMsg incomingMsg model

        OutgoingMsg outgoingMsg ->
            handleOutgoingMsg outgoingMsg model

        InternalMsg internalMsg ->
            handleInternalMsg internalMsg model


handleIncomingMsg : IncomingMsg -> Model -> ( Model, Cmd Msg )
handleIncomingMsg incomingMsg model =
    case incomingMsg of
        LinkListGotten result ->
            handleGottenLinks result model

        StringResponse result ->
            handleStringResponse result model


handleOutgoingMsg : OutgoingMsg -> Model -> ( Model, Cmd Msg )
handleOutgoingMsg outMsg model =
    case outMsg of
        GetLinks ->
            handleGetLinks model

        CreateLink ->
            handleCreateLink
                model.originalUrlInput
                model.shortenedUrlInput
                model

        DeleteLink short ->
            handleDeleteLink short model


handleInternalMsg : InternalMsg -> Model -> ( Model, Cmd Msg )
handleInternalMsg msg model =
    case msg of
        OriginalUrlInput input ->
            ( { model | originalUrlInput = input }, Cmd.none )

        ShortenedUrlInput input ->
            ( { model | shortenedUrlInput = input }, Cmd.none )


handleGetLinks : Model -> ( Model, Cmd Msg )
handleGetLinks model =
    ( { model | status = Loading }
    , Http.get
        { expect = Http.expectJson (IncomingMsg << LinkListGotten) linkListDecoder
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
        , expect = Http.expectString (IncomingMsg << StringResponse)
        , url = "http://localhost:3333/shortlinks"
        }
    )


handleStringResponse : Result Http.Error String -> Model -> ( Model, Cmd Msg )
handleStringResponse result model =
    case result of
        Ok _ ->
            let
                ( newModel, cmd ) =
                    handleGetLinks model
            in
            ( { newModel | status = Success, originalUrlInput = "", shortenedUrlInput = "" }, cmd )

        Err errMsg ->
            ( { model | status = Error (httpErrorToString errMsg) }, Cmd.none )


handleDeleteLink : String -> Model -> ( Model, Cmd Msg )
handleDeleteLink short model =
    ( { model | status = Loading }
    , Http.request
        { body = Http.emptyBody
        , expect = Http.expectString (IncomingMsg << StringResponse)
        , headers = []
        , url = "http://localhost:3333/shortlinks/" ++ short
        , method = "DELETE"
        , timeout = Nothing
        , tracker = Nothing
        }
    )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



-- VIEW


view : Model -> Html Msg
view model =
    let
        renderStatus : Html Msg
        renderStatus =
            case model.status of
                Loading ->
                    div [] [ text "Loading" ]

                Success ->
                    div [] [ text "List Loaded" ]

                Error errorMsg ->
                    div [] [ text errorMsg ]

        renderForm : Html Msg
        renderForm =
            form [ onSubmit (OutgoingMsg CreateLink) ]
                [ div []
                    [ text "Original Link" ]
                , div []
                    [ input
                        [ placeholder "https://"
                        , onInput (InternalMsg << OriginalUrlInput)
                        , value model.originalUrlInput
                        ]
                        []
                    ]
                , div []
                    [ text "Your Shortened Link" ]
                , div []
                    [ input
                        [ placeholder "brev.ly/"
                        , onInput (InternalMsg << ShortenedUrlInput)
                        , value model.shortenedUrlInput
                        ]
                        []
                    ]
                , button [] [ text "Create" ]
                ]
    in
    div []
        [ renderForm
        , renderStatus
        , LinkListView.renderLinkList
            -- This is a fn that turns a string into a Msg.
            -- In this case, we're building the message to delete a link.
            (\strToDelMsg -> OutgoingMsg (DeleteLink strToDelMsg))
            model
        ]
