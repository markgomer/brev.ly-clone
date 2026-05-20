module Controller exposing
    ( createLink
    , deleteLink
    , getLinks
    , handleGottenLinks
    , handleOriginalUrlInput
    , handleShortenedUrlInput
    , handleStringResponse
    )

import Data exposing (Link, Model, Status(..), linkEncoder, linkListDecoder)
import Http


handleOriginalUrlInput : String -> Model -> ( Model, Cmd msg )
handleOriginalUrlInput input model =
    ( { model | originalUrlInput = input }, Cmd.none )


handleShortenedUrlInput : String -> Model -> ( Model, Cmd msg )
handleShortenedUrlInput input model =
    ( { model | shortenedUrlInput = input }, Cmd.none )


getLinks : (Result Http.Error (List Link) -> msg) -> Model -> ( Model, Cmd msg )
getLinks toMsg model =
    ( { model | status = Loading }
    , Http.get
        { expect = Http.expectJson toMsg linkListDecoder
        , url = "http://localhost:3333/shortlinks"
        }
    )


handleGottenLinks : Result Http.Error (List Link) -> Model -> ( Model, Cmd msg )
handleGottenLinks result model =
    case result of
        Ok linkList ->
            ( { model | links = linkList, status = Success }, Cmd.none )

        Err errMsg ->
            ( { model | status = Error (httpErrorToString errMsg) }, Cmd.none )


createLink : (Result Http.Error String -> msg) -> String -> String -> Model -> ( Model, Cmd msg )
createLink toMsg original short model =
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
        , expect = Http.expectString toMsg
        , url = "http://localhost:3333/shortlinks"
        }
    )


handleStringResponse : (Result Http.Error (List Link) -> msg) -> Result Http.Error String -> Model -> ( Model, Cmd msg )
handleStringResponse toGetLinksMsg result model =
    case result of
        Ok _ ->
            let
                ( newModel, cmd ) =
                    getLinks toGetLinksMsg model
            in
            ( { newModel | status = Success, originalUrlInput = "", shortenedUrlInput = "" }, cmd )

        Err errMsg ->
            ( { model | status = Error (httpErrorToString errMsg) }, Cmd.none )


deleteLink : (Result Http.Error String -> msg) -> String -> Model -> ( Model, Cmd msg )
deleteLink toMsg short model =
    ( { model | status = Loading }
    , Http.request
        { body = Http.emptyBody
        , expect = Http.expectString toMsg
        , headers = []
        , url = "http://localhost:3333/shortlinks/" ++ short
        , method = "DELETE"
        , timeout = Nothing
        , tracker = Nothing
        }
    )


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
