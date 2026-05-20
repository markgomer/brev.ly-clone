port module Main exposing (Msg(..), OutgoingMsg(..), main)

import Browser
import Controller
import Data exposing (Link, Model, Page(..), Status(..))
import Html exposing (Html)
import Http
import View


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
    Controller.getLinks (IncomingMsg << LinkListGotten) (Model [] "" "" Loading Home)



-- PORTS


port redirect : String -> Cmd msg



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
    | GoToRedirectPage String
    | GoToHome


type Msg
    = InternalMsg InternalMsg
    | OutgoingMsg OutgoingMsg
    | IncomingMsg IncomingMsg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        IncomingMsg incomingMsg ->
            case incomingMsg of
                LinkListGotten result ->
                    Controller.handleGottenLinks result model

                StringResponse result ->
                    Controller.handleStringResponse (IncomingMsg << LinkListGotten) result model

        OutgoingMsg outgoingMsg ->
            case outgoingMsg of
                GetLinks ->
                    Controller.getLinks (IncomingMsg << LinkListGotten) model

                CreateLink ->
                    Controller.createLink
                        (IncomingMsg << StringResponse)
                        model.originalUrlInput
                        model.shortenedUrlInput
                        model

                DeleteLink short ->
                    Controller.deleteLink
                        (IncomingMsg << StringResponse)
                        short
                        model

        InternalMsg internalMsg ->
            case internalMsg of
                OriginalUrlInput input ->
                    Controller.handleOriginalUrlInput input model

                ShortenedUrlInput input ->
                    Controller.handleShortenedUrlInput input model

                GoToRedirectPage slug ->
                    ( { model | page = RedirectPage slug }
                      -- we send the slug to the JS port, so it will do the redirection
                    , redirect slug
                    )

                GoToHome ->
                    Controller.getLinks
                        (IncomingMsg << LinkListGotten)
                        { model | page = Home }



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



-- VIEW


view : Model -> Html Msg
view model =
    View.view
        { originalUrlInput = InternalMsg << OriginalUrlInput
        , shortenedUrlInput = InternalMsg << ShortenedUrlInput
        , createLink = OutgoingMsg CreateLink
        , deleteLink = OutgoingMsg << DeleteLink
        , goToRedirect = InternalMsg << GoToRedirectPage
        , goToHome = InternalMsg GoToHome
        }
        model
