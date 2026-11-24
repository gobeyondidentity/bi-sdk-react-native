if(NOT TARGET hermes-engine::hermesvm)
add_library(hermes-engine::hermesvm SHARED IMPORTED)
set_target_properties(hermes-engine::hermesvm PROPERTIES
    IMPORTED_LOCATION "/root/.gradle/caches/9.6.0/transforms/4595db5fe98c95806db749d8984b69c0/transformed/hermes-android-260318099.0.4-release/prefab/modules/hermesvm/libs/android.armeabi-v7a/libhermesvm.so"
    INTERFACE_INCLUDE_DIRECTORIES "/root/.gradle/caches/9.6.0/transforms/4595db5fe98c95806db749d8984b69c0/transformed/hermes-android-260318099.0.4-release/prefab/modules/hermesvm/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

