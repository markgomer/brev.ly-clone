module Data exposing (Link, Model, Page(..), Status(..), linkEncoder, linkListDecoder)

import Json.Decode as D
import Json.Encode as E

-- MODEL


type Page
    = Home
    | RedirectPage String


type alias Model =
    { links : List Link
    , originalUrlInput : String
    , shortenedUrlInput : String
    , status : Status
    , page : Page
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

