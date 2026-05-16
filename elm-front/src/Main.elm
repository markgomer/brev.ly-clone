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
import Html exposing (Html, button, div, h1, input, label, text)
import Html.Attributes exposing (for, placeholder, type_, value)
import Html.Events exposing (onClick, onInput)
import Http
import Json.Encode as Encode


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }


type alias Model =
    { originalLink : String
    , shortenedLink : String
    , numberOfAccesses : Int
    , status : String
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { originalLink = ""
      , shortenedLink = ""
      , numberOfAccesses = 0
      , status = ""
      }
    , Cmd.none
    )


type Msg
    = UpdateOriginal String
    | UpdateShortened String
    | SendCreateRequest
    | GotResponse (Result Http.Error String)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        UpdateOriginal val ->
            ( { model | originalLink = val }, Cmd.none )

        UpdateShortened val ->
            ( { model | shortenedLink = val }, Cmd.none )

        SendCreateRequest ->
            ( { model | status = "Sending..." }
            , Http.post
                { url = "http://localhost:3333/shortlinks"
                , body = Http.jsonBody (encodeRequest model)
                , expect = Http.expectString GotResponse
                }
            )

        GotResponse result ->
            case result of
                Ok _ ->
                    ( { model | status = "Success!", originalLink = "", shortenedLink = "" }, Cmd.none )

                Err _ ->
                    ( { model | status = "Error!" }, Cmd.none )


encodeRequest : Model -> Encode.Value
encodeRequest model =
    Encode.object
        [ ( "originalLink", Encode.string model.originalLink )
        , ( "shortenedLink", Encode.string model.shortenedLink )
        ]


-- called when Model is changed
view : Model -> Html Msg
view model =
    div []
        [ div []
            [ label [ for "original" ] [ text "Original link: " ]
            , input
                [ type_ "text"
                , placeholder "google.com"
                , value model.originalLink
                , onInput UpdateOriginal
                ]
                []
            ]
        , div []
            [ label [ for "shortened" ] [ text "Shortened link: " ]
            , input
                [ type_ "text"
                , placeholder "my-link"
                , value model.shortenedLink
                , onInput UpdateShortened
                ]
                []
            ]
        , button [ onClick SendCreateRequest ] [ text "Send" ]
        , div [] [ text model.status ]
        , div [] [ h1 [] [ text "Model List" ] ]
        , div [] [ Html.span [] [ text "link"] ]
        ]
