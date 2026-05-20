module LinkListView exposing (renderLinkList)

import Data exposing (Link, Model)
import Html exposing (Html, a, button, div, text, span)
import Html.Attributes exposing (class, href, rel, style, target)
import Html.Events exposing (onClick)



-- Elm see output is Msg. Elm substitute a_msg (small) with Msg (capital).
-- Now the signatures match: (String -> Msg) -> (String -> Msg) -> Model -> Html Msg
renderLinkList : (String -> a_msg) -> (String -> a_msg) -> Model -> Html a_msg
renderLinkList delStrToMsg goToRedirectMsg model =
    div [] (List.map (renderLinkCard delStrToMsg goToRedirectMsg) model.links)


renderLinkCard : (String -> a_msg) -> (String -> a_msg) -> Link -> Html a_msg
renderLinkCard delStrToMsg goToRedirectMsg link =
    div
        [ class "flex items-center justify-between py-4 border-b border-slate-100 last:border-0" ]
        [ div [ class "flex flex-col gap-1 min-w-0 flex-1" ]
            [ a
                [ class "text-blue-600 font-bold hover:underline cursor-pointer text-base truncate"
                , onClick (goToRedirectMsg link.shortenedUrl)
                ]
                [ text ("brev.ly/" ++ link.shortenedUrl) ]
            , div [ class "flex items-center gap-2 text-xs text-slate-400 min-w-0" ]
                [ span [ class "truncate max-w-[180px] md:max-w-[240px]" ] [ text link.originalUrl ]
                , span [] [ text "•" ]
                , span [] [ text (String.fromInt link.numberOfAccesses ++ " acessos") ]
                ]
            ]
        , button
            [ class "ml-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors duration-150"
            , onClick (delStrToMsg link.shortenedUrl)
            ]
            [ text "✕" ]
        ]
